/**
 * Email Service Usage Examples
 * 
 * This file demonstrates how to use the email service throughout the application.
 * These are examples - you can import and use emailService and templates anywhere.
 */

import { emailService } from './email.service';
import {
  passwordResetTemplate,
  welcomeTemplate,
  emailVerificationTemplate,
  notificationTemplate,
} from './email.templates';

/**
 * Example 1: Send a password reset email
 */
export async function sendPasswordResetEmail(
  userEmail: string,
  userName: string,
  resetToken: string
): Promise<void> {
  const resetLink = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  const template = passwordResetTemplate({
    name: userName,
    resetLink,
    expiryMinutes: 30,
  });

  await emailService.sendEmailWithBoth(
    userEmail,
    'Password Reset Request',
    template.html,
    template.text
  );
}

/**
 * Example 2: Send a welcome email
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
): Promise<void> {
  const loginLink = `${process.env.APP_URL || 'http://localhost:3000'}/login`;
  const template = welcomeTemplate({
    name: userName,
    loginLink,
  });

  await emailService.sendEmailWithBoth(
    userEmail,
    'Welcome to App 2026!',
    template.html,
    template.text
  );
}

/**
 * Example 3: Send an email verification email
 */
export async function sendVerificationEmail(
  userEmail: string,
  userName: string,
  verificationToken: string
): Promise<void> {
  const verificationLink = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
  const template = emailVerificationTemplate({
    name: userName,
    verificationLink,
    expiryMinutes: 24 * 60, // 24 hours
  });

  await emailService.sendEmailWithBoth(
    userEmail,
    'Verify Your Email Address',
    template.html,
    template.text
  );
}

/**
 * Example 4: Send a simple text email
 */
export async function sendSimpleEmail(
  userEmail: string,
  message: string
): Promise<void> {
  await emailService.sendTextEmail(
    userEmail,
    'Notification',
    message
  );
}

/**
 * Example 5: Send a custom HTML email
 */
export async function sendCustomEmail(
  userEmail: string,
  subject: string,
  htmlContent: string
): Promise<void> {
  await emailService.sendHtmlEmail(
    userEmail,
    subject,
    htmlContent
  );
}

/**
 * Example 6: Send email to multiple recipients
 */
export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  message: string
): Promise<void> {
  await emailService.sendTextEmail(
    recipients,
    subject,
    message
  );
}

/**
 * Example 7: Send email with attachments
 */
export async function sendEmailWithAttachment(
  userEmail: string,
  subject: string,
  message: string,
  attachmentPath: string
): Promise<void> {
  await emailService.sendEmail({
    to: userEmail,
    subject,
    text: message,
    attachments: [
      {
        filename: 'attachment.pdf',
        path: attachmentPath,
      },
    ],
  });
}

/**
 * Example 8: Send notification email
 */
export async function sendNotificationEmail(
  userEmail: string,
  title: string,
  message: string,
  actionLink?: string
): Promise<void> {
  const template = notificationTemplate(
    title,
    message,
    actionLink,
    'View Details'
  );

  await emailService.sendEmailWithBoth(
    userEmail,
    title,
    template.html,
    template.text
  );
}

