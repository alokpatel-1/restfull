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
    const transport = this.getTransporter();
    await transport.sendMail({
      from: envConfig.MAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }

  async sendVerificationEmail(email: string, token: string, name: string): Promise<void> {
    const verifyUrl = `${envConfig.APP_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
    const html = `
      <p>Hi ${name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you did not create an account, you can ignore this email.</p>
    `;
    await this.send({
      to: email,
      subject: 'Verify your email',
      html,
      text: `Hi ${name}, please verify your email: ${verifyUrl}`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string, name: string): Promise<void> {
    const resetUrl = `${envConfig.APP_BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;
    const html = `
      <p>Hi ${name},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `;
    await this.send({
      to: email,
      subject: 'Reset your password',
      html,
      text: `Hi ${name}, reset your password: ${resetUrl}`,
    });
  }
}

export const mailService = new MailService();
