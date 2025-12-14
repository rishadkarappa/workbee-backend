export interface IEmailService {
    sendApprovalEmail(email: string, name: string): Promise<void>;
    sendRejectionEmail(email: string, name: string, reason: string): Promise<void>;
}