import { Dispute, DisputeAction, DisputeStatus, NewDispute } from "../entities/Dispute";

export interface IDisputeRepository {
  create(dispute: NewDispute): Promise<Dispute>;
  findById(id: string): Promise<Dispute | null>;
  findByUserId(userId: string): Promise<Dispute[]>;
  findByWorkerId(workerId: string): Promise<Dispute[]>;
  findAll(filters: {
    page: number; limit: number; status?: string; search?: string;
  }): Promise<{ disputes: Dispute[]; total: number }>;
  addAction(id: string, action: DisputeAction, newStatus: DisputeStatus): Promise<Dispute | null>;
  countActionsForWorker(workerId: string): Promise<number>;
  countActionsForUser(userId: string): Promise<number>;
}