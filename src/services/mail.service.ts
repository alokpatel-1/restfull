/**
 * Mail service for sending verification and password reset emails.
 * Uses Nodemailer with SMTP (configurable via env).
 */

import nodemailer from 'nodemailer';
import { envConfig } from '../config/env.config';

export interface MailServiceOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class MailService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: envConfig.SMTP_HOST,
        port: envConfig.SMTP_PORT,
        secure: envConfig.SMTP_PORT === 465,
        auth:
          envConfig.SMTP_USER && envConfig.SMTP_PASS
            ? { user: envConfig.SMTP_USER, pass: envConfig.SMTP_PASS }
            : undefined,
      });
    }
    return this.transporter;
  }

  async send(options: MailServiceOptions): Promise<void> {
    try {
      const transport = this.getTransporter();
      const fromAddress = envConfig.MAIL_FROM_NAME
        ? `"${envConfig.MAIL_FROM_NAME}" <${envConfig.MAIL_FROM}>`
        : envConfig.MAIL_FROM;
      await transport.sendMail({
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    } catch (err) {
      console.error('Mail send failed:', err instanceof Error ? err.message : err);
      // In development, log the link so you can use it without SMTP
      if (envConfig.NODE_ENV === 'development' && options.text) {
        const urlMatch = options.text.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          console.log('[DEV] Use this link (no SMTP):', urlMatch[0]);
        }
      }
    }
  }

  private getEmailLayout(content: string, brandName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 28px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600; letter-spacing: -0.5px;">${brandName}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 24px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px 28px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; color: #6b7280; font-size: 12px; text-align: center;">
              This email was sent by ${brandName}. If you did not request this, you can safely ignore it.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private getButtonHtml(url: string, label: string): string {
    return `
<table role="presentation" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
  <tr>
    <td style="border-radius: 8px; background-color: #2563eb;">
      <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px;">${label}</a>
    </td>
  </tr>
</table>`;
  }

  async sendVerificationEmail(email: string, token: string, name: string): Promise<void> {
    const verifyUrl = `${envConfig.APP_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
    const brandName = envConfig.MAIL_FROM_NAME || 'Our App';
    const content = `
      <p style="margin: 0 0 8px; color: #111827; font-size: 16px; line-height: 1.5;">Hi ${name},</p>
      <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.6;">Thanks for signing up. Please verify your email address by clicking the button below.</p>
      ${this.getButtonHtml(verifyUrl, 'Verify my email')}
      <p style="margin: 16px 0 0; color: #6b7280; font-size: 13px; line-height: 1.5;">This link expires in 24 hours.</p>
      <p style="margin: 12px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">If you didn't create an account, you can ignore this email.</p>
    `;
    const html = this.getEmailLayout(content, brandName);
    await this.send({
      to: email,
      subject: 'Verify your email',
      html,
      text: `Hi ${name}, please verify your email: ${verifyUrl}`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string, name: string): Promise<void> {
    const resetUrl = `${envConfig.APP_BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;
    const brandName = envConfig.MAIL_FROM_NAME || 'Our App';
    const content = `
      <p style="margin: 0 0 8px; color: #111827; font-size: 16px; line-height: 1.5;">Hi ${name},</p>
      <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new one.</p>
      ${this.getButtonHtml(resetUrl, 'Reset password')}
      <p style="margin: 16px 0 0; color: #6b7280; font-size: 13px; line-height: 1.5;">This link expires in 1 hour.</p>
      <p style="margin: 12px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">If you didn't request this, you can ignore this email. Your password will stay the same.</p>
    `;
    const html = this.getEmailLayout(content, brandName);
    await this.send({
      to: email,
      subject: 'Reset your password',
      html,
      text: `Hi ${name}, reset your password: ${resetUrl}`,
    });
  }
}

export const mailService = new MailService();
