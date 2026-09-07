export type ComplaintType =
  | "against_worker"
  | "about_work"
  | "cleanliness"
  | "behavior"
  | "work_not_completed"
  | "fraud_suspicion"
  | "other";

export type DisputeStatus = "pending" | "in_review" | "resolved" | "dismissed";

export type DisputeActionType =
  | "block_worker"
  | "unblock_worker"
  | "block_user"
  | "unblock_user"
  | "blacklist_worker"
  | "unblacklist_worker"
  | "blacklist_user"
  | "unblacklist_user"
  | "warning_email_worker"
  | "warning_email_user"
  | "no_action";

export interface DisputeAction {
  actionType: DisputeActionType;
  reason: string;
  takenBy: string;
  takenAt: Date;
}

export interface Dispute {
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
  actions: DisputeAction[];
  createdAt: Date;
  updatedAt: Date;
}

export type NewDispute = Omit<Dispute, "id" | "status" | "actions" | "createdAt" | "updatedAt">;