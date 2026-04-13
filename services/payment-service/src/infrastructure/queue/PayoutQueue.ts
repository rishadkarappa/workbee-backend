import { Queue, Worker, Job } from "bullmq";
import { container } from "tsyringe";
import { ReleaseWorkerPayoutUseCase } from "../../application/use-cases/ReleaseWorkerPayoutUseCase";

const REDIS_CONNECTION = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

const QUEUE_NAME = "worker-payout";
const DELAY_MS   = 2 * 60 * 1000; // 1 hour

let payoutQueue: Queue | null = null;
let payoutWorker: Worker | null = null;

// Queue (producer) 
export const getPayoutQueue = (): Queue => {
  if (!payoutQueue) {
    payoutQueue = new Queue(QUEUE_NAME, {
      connection: REDIS_CONNECTION,
      defaultJobOptions: {
        attempts:    3,
        backoff:     { type: "exponential", delay: 5000 },
        removeOnComplete: 100,
        removeOnFail:     50,
      },
    });
    console.log("[PayoutQueue] Queue created");
  }
  return payoutQueue;
};

export const scheduleWorkerPayout = async (paymentId: string): Promise<void> => {
  const queue = getPayoutQueue();
  await queue.add(
    "release-payout",
    { paymentId },
    { delay: DELAY_MS }
  );
  console.log(`[PayoutQueue] Scheduled payout for payment ${paymentId} in 1 hour`);
};

// Worker (consumer)
export const startPayoutWorker = (): void => {
  payoutWorker = new Worker(
    QUEUE_NAME,
    async (job: Job) => {
      const { paymentId } = job.data;
      console.log(`[PayoutWorker] Processing payout for payment ${paymentId}`);

      const releaseUseCase = container.resolve(ReleaseWorkerPayoutUseCase);
      await releaseUseCase.execute(paymentId);

      console.log(`[PayoutWorker] Payout complete for payment ${paymentId}`);
    },
    { connection: REDIS_CONNECTION, concurrency: 5 }
  );

  payoutWorker.on("completed", (job) => {
    console.log(`[PayoutWorker] Job ${job.id} completed`);
  });

  payoutWorker.on("failed", (job, err) => {
    console.error(`[PayoutWorker] Job ${job?.id} failed:`, err.message);
  });

  console.log("[PayoutWorker] Worker started, listening for payout jobs");
};