import { injectable } from "tsyringe";
import nodemailer from "nodemailer";
import { IEmailService } from "../../domain/services/IEmailService";

@injectable()
export class EmailService implements IEmailService {
    private transporter;

    constructor() {
        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn(" Email credentials not configured. Emails will not be sent.");
            this.transporter = null;
        } else {
            this.transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        }
    }

    async sendApprovalEmail(email: string, name: string): Promise<void> {
        if (!this.transporter) {
            console.log("📧 [SIMULATED] Approval email to:", email);
            return;
        }

        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "🎉 Your WorkBee Worker Application Has Been Approved!",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #10b981; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
                            </div>
                            
                            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                                Dear <strong>${name}</strong>,
                            </p>
                            
                            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                                We're thrilled to inform you that your application to become a worker on <strong>WorkBee</strong> has been <span style="color: #10b981; font-weight: bold;">approved</span>!
                            </p>
                            
                            <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 5px;">
                                <p style="margin: 0; color: #065f46; font-weight: 500;">
                                    ✅ You are now an official WorkBee worker!
                                </p>
                            </div>
                            
                            <h3 style="color: #1f2937; margin-top: 25px;">What's Next?</h3>
                            <ul style="color: #374151; line-height: 1.8;">
                                <li>Log in to your worker dashboard</li>
                                <li>Complete your profile</li>
                                <li>Start accepting work requests</li>
                                <li>Build your reputation and earn money</li>
                            </ul>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/worker/worker-login" 
                                   style="display: inline-block; background-color: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                    Log In to Dashboard
                                </a>
                            </div>
                            
                            <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                If you have any questions, feel free to contact our support team.<br/><br/>
                                Best regards,<br/>
                                <strong>The WorkBee Team</strong>
                            </p>
                        </div>
                    </div>
                `,
            };

            await this.transporter.sendMail(mailOptions);
            console.log("✅ Approval email sent to:", email);
        } catch (error) {
            console.error("❌ Failed to send approval email:", error);
            // Don't throw error - allow the approval to succeed even if email fails
        }
    }

    async sendRejectionEmail(email: string, name: string, reason: string): Promise<void> {
        if (!this.transporter) {
            console.log("📧 [SIMULATED] Rejection email to:", email);
            console.log("Reason:", reason);
            return;
        }

        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "WorkBee Application Status Update",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
                        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #ef4444; margin: 0; font-size: 28px;">Application Status Update</h1>
                            </div>
                            
                            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                                Dear <strong>${name}</strong>,
                            </p>
                            
                            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                                Thank you for your interest in becoming a worker on WorkBee.
                            </p>
                            
                            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                                After careful review, we regret to inform you that we cannot approve your application at this time.
                            </p>
                            
                            <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; margin: 25px 0; border-radius: 5px;">
                                <p style="margin: 0 0 10px 0; color: #991b1b; font-weight: 600; font-size: 15px;">
                                    📋 Reason for rejection:
                                </p>
                                <p style="margin: 0; color: #7f1d1d; line-height: 1.6; font-size: 15px;">
                                    ${reason}
                                </p>
                            </div>

                            <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
                                <p style="margin: 0; color: #1e40af; font-weight: 500;">
                                    💡 Don't worry! You can reapply after addressing the concerns mentioned above.
                                </p>
                            </div>
                            
                            <h3 style="color: #1f2937; margin-top: 25px;">Next Steps:</h3>
                            <ul style="color: #374151; line-height: 1.8;">
                                <li>Review the rejection reason carefully</li>
                                <li>Address the mentioned concerns</li>
                                <li>Submit a new application when ready</li>
                            </ul>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/worker/apply-worker" 
                                   style="display: inline-block; background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                    Reapply Now
                                </a>
                            </div>
                            
                            <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                If you have any questions about this decision, please don't hesitate to contact our support team.<br/><br/>
                                Best regards,<br/>
                                <strong>The WorkBee Team</strong>
                            </p>
                        </div>
                    </div>
                `,
            };

            await this.transporter.sendMail(mailOptions);
            console.log("✅ Rejection email sent to:", email);
        } catch (error) {
            console.error("❌ Failed to send rejection email:", error);
            // Don't throw error - allow the rejection to succeed even if email fails
        }
    }
}