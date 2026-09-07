import { ComplaintType, DisputeActionType, DisputeStatus } from "../../../domain/entities/Dispute";

export interface CreateDisputeDto {
  workId: string;
  workerId: string;
  userId: string;
  complaintType: ComplaintType;
  description: string;
  proofImages?: string[];
  proofVideo?: string;
}

export interface ApplyDisputeActionDto {
  disputeId: string;
  actionType: DisputeActionType;
  reason: string;
  adminId: string;
}

export interface GetAllDisputesFilterDto {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

export interface DisputeResponseDto {
  id: string;
  workId: string;
  workTitle: string;
  userId: string;
  workerId: string;
  complaintType: ComplaintType;
  description: string;
  proofImages: string[];
  proofVideo?: string;
  status: DisputeStatus;
  actions: {
    actionType: DisputeActionType;
    reason: string;
    takenBy: string;
    takenAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkerSummaryDto {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  isBlocked: boolean;
  isBlacklisted: boolean;
  totalWorksCompleted: number;
  totalActionsTaken: number;
}

export interface UserSummaryDto {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  isBlocked: boolean;
  isBlacklisted: boolean;
  totalActionsTaken: number;
}

export interface DisputeDetailResponseDto extends DisputeResponseDto {
  worker: WorkerSummaryDto;
  user: UserSummaryDto;
}