-- WorkBee Payment Service - PostgreSQL Schema (Razorpay version)
-- Run this in pgAdmin Query Tool on your payment service DB


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- WALLETS TABLE

CREATE TABLE wallets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id        VARCHAR(255) NOT NULL,
    role            VARCHAR(20)  NOT NULL CHECK (role IN ('user', 'worker', 'admin')),
    balance         NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    pending_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_earned    NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_spent     NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (owner_id, role)
);


-- TRANSACTIONS TABLE

CREATE TABLE transactions (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id             UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    work_id               VARCHAR(255),
    razorpay_payment_id   VARCHAR(255),        -- renamed from stripe_payment_intent_id
    type                  VARCHAR(50) NOT NULL CHECK (type IN (
                              'payment', 'credit', 'platform_fee',
                              'refund',  'hold',   'release'
                          )),
    amount                NUMERIC(12, 2) NOT NULL,
    currency              VARCHAR(10) NOT NULL DEFAULT 'INR',
    status                VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN (
                              'pending', 'completed', 'failed', 'refunded'
                          )),
    description           TEXT,
    metadata              JSONB,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- PAYMENTS TABLE

CREATE TABLE payments (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id               VARCHAR(255) NOT NULL,
    user_id               VARCHAR(255) NOT NULL,
    worker_id             VARCHAR(255) NOT NULL,
    razorpay_order_id     VARCHAR(255) UNIQUE,   -- renamed from stripe_session_id
    razorpay_payment_id   VARCHAR(255) UNIQUE,   -- renamed from stripe_payment_intent_id
    amount                NUMERIC(12, 2) NOT NULL,
    platform_fee          NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    worker_payout         NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency              VARCHAR(10) NOT NULL DEFAULT 'INR',
    status                VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN (
                              'pending', 'paid', 'worker_credited', 'refunded', 'failed'
                          )),
    work_completed_at     TIMESTAMPTZ,
    payout_scheduled_at   TIMESTAMPTZ,
    payout_completed_at   TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- PLATFORM_EARNINGS TABLE

CREATE TABLE platform_earnings (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id     UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    work_id        VARCHAR(255) NOT NULL,
    fee_amount     NUMERIC(12, 2) NOT NULL,
    currency       VARCHAR(10) NOT NULL DEFAULT 'INR',
    collected_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- INDEXES

CREATE INDEX idx_wallets_owner              ON wallets(owner_id, role);
CREATE INDEX idx_transactions_wallet        ON transactions(wallet_id);
CREATE INDEX idx_transactions_work          ON transactions(work_id);
CREATE INDEX idx_payments_work              ON payments(work_id);
CREATE INDEX idx_payments_user              ON payments(user_id);
CREATE INDEX idx_payments_worker            ON payments(worker_id);
CREATE INDEX idx_payments_razorpay_order    ON payments(razorpay_order_id);


-- AUTO-UPDATE updated_at trigger

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_wallets_updated_at
    BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();