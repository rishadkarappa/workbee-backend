-- ============================================================
-- WorkBee Payment Service - PostgreSQL Schema
-- Run this in pgAdmin Query Tool on your payment service DB
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- WALLETS TABLE
-- One wallet per user OR worker (role distinguishes them)
-- ============================================================
CREATE TABLE wallets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id        VARCHAR(255) NOT NULL,      -- MongoDB userId or workerId
    role            VARCHAR(20)  NOT NULL CHECK (role IN ('user', 'worker', 'admin')),
    balance         NUMERIC(12, 2) NOT NULL DEFAULT 0.00,      -- available/withdrawable
    pending_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,      -- held, not yet released
    total_earned    NUMERIC(12, 2) NOT NULL DEFAULT 0.00,      -- lifetime earned (workers)
    total_spent     NUMERIC(12, 2) NOT NULL DEFAULT 0.00,      -- lifetime spent  (users)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (owner_id, role)
);

-- ============================================================
-- TRANSACTIONS TABLE
-- Every money movement recorded here
-- ============================================================
CREATE TABLE transactions (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id        UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    work_id          VARCHAR(255),               -- MongoDB work _id (optional)
    stripe_payment_intent_id VARCHAR(255),       -- Stripe PaymentIntent id
    type             VARCHAR(50) NOT NULL CHECK (type IN (
                         'payment',        -- user pays for work
                         'credit',         -- worker receives payment
                         'platform_fee',   -- 1% deducted before credit
                         'refund',         -- reversed payment
                         'hold',           -- funds placed in pending
                         'release'         -- pending → available
                     )),
    amount           NUMERIC(12, 2) NOT NULL,
    currency         VARCHAR(10) NOT NULL DEFAULT 'INR',
    status           VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN (
                         'pending', 'completed', 'failed', 'refunded'
                     )),
    description      TEXT,
    metadata         JSONB,                      -- extra context (work title, names etc)
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS TABLE
-- One row per Stripe payment session (tracks the full lifecycle)
-- ============================================================
CREATE TABLE payments (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id                  VARCHAR(255) NOT NULL,
    user_id                  VARCHAR(255) NOT NULL,
    worker_id                VARCHAR(255) NOT NULL,
    stripe_session_id        VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    amount                   NUMERIC(12, 2) NOT NULL,        -- total amount user paid
    platform_fee             NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 1% of amount
    worker_payout            NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 99% of amount
    currency                 VARCHAR(10) NOT NULL DEFAULT 'INR',
    status                   VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN (
                                 'pending',          -- session created, not paid yet
                                 'paid',             -- stripe confirmed payment
                                 'worker_credited',  -- payout done to worker wallet
                                 'refunded',
                                 'failed'
                             )),
    work_completed_at        TIMESTAMPTZ,                   -- when worker marked complete
    payout_scheduled_at      TIMESTAMPTZ,                   -- when 1hr job was queued
    payout_completed_at      TIMESTAMPTZ,                   -- when worker was credited
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PLATFORM_EARNINGS TABLE
-- Admin-facing summary of all platform fees collected
-- ============================================================
CREATE TABLE platform_earnings (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id     UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    work_id        VARCHAR(255) NOT NULL,
    fee_amount     NUMERIC(12, 2) NOT NULL,
    currency       VARCHAR(10) NOT NULL DEFAULT 'INR',
    collected_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_wallets_owner     ON wallets(owner_id, role);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_work   ON transactions(work_id);
CREATE INDEX idx_payments_work     ON payments(work_id);
CREATE INDEX idx_payments_user     ON payments(user_id);
CREATE INDEX idx_payments_worker   ON payments(worker_id);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_session_id);
CREATE INDEX idx_platform_earnings_payment ON platform_earnings(payment_id);

-- ============================================================
-- AUTO-UPDATE updated_at trigger
-- ============================================================
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