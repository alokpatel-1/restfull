/**
 * Email Service
 * 
 * This file provides a centralized email service using nodemailer.
 * It can be used throughout the application to send emails.
 * Supports HTML and plain text emails with templates.
 */

import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { envConfig } from '../../config/env.config';
import { logger } from './logger';

/**
 * Email options interface
 */
export interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Array<{
        filename: string;
        path?: string;
        content?: string | Buffer;
        contentType?: string;
    }>;
}

/**
 * Email service class
 * Handles email sending using nodemailer
 */
class EmailService {
    private transporter: Transporter | null = null;
    private configWarningLogged: boolean = false;

    /**
     * Checks if email service is configured
     */
    private isConfigured(): boolean {
        return !!(envConfig.SMTP_USER && envConfig.SMTP_PASS);
    }

    /**
     * Initializes the email transporter
     * Creates a reusable transporter using SMTP configuration
     */
    private initializeTransporter(): void {
        if (this.transporter) {
            return;
        }

        // Check if email is configured
        if (!this.isConfigured()) {
            if (!this.configWarningLogged) {
                logger.warn('Email service not configured. SMTP credentials missing. Emails will not be sent.');
                this.configWarningLogged = true;
            }
            return;
        }

        try {
            this.transporter = nodemailer.createTransport({
                host: envConfig.SMTP_HOST,
                port: envConfig.SMTP_PORT,
                secure: envConfig.SMTP_SECURE, // true for 465, false for other ports
                auth: {
                    user: envConfig.SMTP_USER,
                    pass: envConfig.SMTP_PASS,
                },
            });

            logger.info('Email transporter initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize email transporter:', error);
            throw error;
        }
    }

    /**
     * Verifies the email transporter connection
     * @returns Promise<boolean> - True if connection is successful
     */
    public async verifyConnection(): Promise<boolean> {
        try {
            this.initializeTransporter();
            if (!this.transporter) {
                return false;
            }
            await this.transporter.verify();
            logger.info('Email service connection verified');
            return true;
        } catch (error) {
            logger.error('Email service connection verification failed:', error);
            return false;
        }
    }

    /**
     * Sends an email
     * @param options - Email options (to, subject, text/html, etc.)
     * @returns Promise<boolean> - True if email was sent successfully
     */
    public async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            // Check if email is configured before attempting to send
            if (!this.isConfigured()) {
                // Warning already logged during initialization, just return false silently
                return false;
            }

            this.initializeTransporter();

            if (!this.transporter) {
                logger.warn('Email transporter not initialized. Check SMTP configuration.');
                return false;
            }

            const mailOptions: SendMailOptions = {
                from: `"${envConfig.EMAIL_FROM_NAME}" <${envConfig.EMAIL_FROM}>`,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
                cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
                bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
                attachments: options.attachments,
            };

            const info = await this.transporter.sendMail(mailOptions);
            logger.info(`Email sent successfully to ${options.to}`, {
                messageId: info.messageId,
                subject: options.subject,
                response: info.response,
                accepted: info.accepted,
                rejected: info.rejected,
            });

            // Check if email was actually accepted by SMTP server
            if (info.rejected && info.rejected.length > 0) {
                logger.warn(`Email was rejected by SMTP server:`, {
                    rejected: info.rejected,
                    to: options.to,
                });
                return false;
            }

            return true;
        } catch (error: any) {
            // Provide helpful error messages for common authentication issues
            let errorMessage = 'Failed to send email';
            let helpfulHint = '';

            if (error.code === 'EAUTH') {
                errorMessage = 'SMTP Authentication failed';
                helpfulHint = 'Check your SMTP credentials. For Gmail, make sure you are using an App Password (not your regular password). Generate one at: https://myaccount.google.com/apppasswords';
            } else if (error.code === 'ECONNECTION') {
                errorMessage = 'SMTP Connection failed';
                helpfulHint = 'Check your SMTP_HOST and SMTP_PORT settings. Make sure your firewall allows outbound connections on the SMTP port.';
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage = 'SMTP Connection timeout';
                helpfulHint = 'The SMTP server did not respond in time. Check your network connection and SMTP server settings.';
            } else if (error.responseCode === 535) {
                errorMessage = 'SMTP Authentication rejected';
                helpfulHint = 'Username and Password not accepted. For Gmail: 1) Enable 2-Step Verification, 2) Generate an App Password at https://myaccount.google.com/apppasswords, 3) Use the App Password (not your regular password) in SMTP_PASS';
            } else if (error.responseCode === 534) {
                errorMessage = 'SMTP Authentication mechanism not supported';
                helpfulHint = 'Try using SMTP_PORT=587 with SMTP_SECURE=false (TLS) instead of port 465.';
            }

            logger.error(errorMessage, {
                error: {
                    code: error.code,
                    message: error.message,
                    response: error.response,
                    responseCode: error.responseCode,
                },
                to: options.to,
                subject: options.subject,
                hint: helpfulHint,
            });

            // Log the helpful hint separately for better visibility
            if (helpfulHint) {
                logger.warn('Email sending hint:', { hint: helpfulHint });
            }

            return false;
        }
    }

    /**
     * Sends a plain text email
     * @param to - Recipient email address(es)
     * @param subject - Email subject
     * @param text - Plain text content
     * @returns Promise<boolean> - True if email was sent successfully
     */
    public async sendTextEmail(
        to: string | string[],
        subject: string,
        text: string
    ): Promise<boolean> {
        return this.sendEmail({ to, subject, text });
    }

    /**
     * Sends an HTML email
     * @param to - Recipient email address(es)
     * @param subject - Email subject
     * @param html - HTML content
     * @param text - Optional plain text fallback
     * @returns Promise<boolean> - True if email was sent successfully
     */
    public async sendHtmlEmail(
        to: string | string[],
        subject: string,
        html: string,
        text?: string
    ): Promise<boolean> {
        return this.sendEmail({ to, subject, html, text });
    }

    /**
     * Sends an email with both HTML and plain text
     * @param to - Recipient email address(es)
     * @param subject - Email subject
     * @param html - HTML content
     * @param text - Plain text content
     * @returns Promise<boolean> - True if email was sent successfully
     */
    public async sendEmailWithBoth(
        to: string | string[],
        subject: string,
        html: string,
        text: string
    ): Promise<boolean> {
        return this.sendEmail({ to, subject, html, text });
    }
}

// Export a singleton instance
export const emailService = new EmailService();

