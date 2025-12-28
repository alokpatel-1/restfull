/**
 * Email Templates
 * 
 * This file contains reusable email templates.
 * Templates can be customized and used throughout the application.
 */

/**
 * Base email template with common styling
 */
const baseTemplate = (content: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 5px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>App 2026</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} App 2026. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Email template interfaces
 */
export interface PasswordResetTemplateData {
  name: string;
  resetLink: string;
  expiryMinutes?: number;
}

export interface WelcomeTemplateData {
  name: string;
  loginLink?: string;
}

export interface EmailVerificationTemplateData {
  name: string;
  verificationLink: string;
  expiryMinutes?: number;
}

/**
 * Password reset email template
 */
export function passwordResetTemplate(data: PasswordResetTemplateData): { html: string; text: string } {
  const html = baseTemplate(`
    <h2>Password Reset Request</h2>
    <p>Hello ${data.name},</p>
    <p>You have requested to reset your password. Click the button below to reset it:</p>
    <div style="text-align: center;">
      <a href="${data.resetLink}" class="button">Reset Password</a>
    </div>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all;">${data.resetLink}</p>
    ${data.expiryMinutes ? `<p><strong>This link will expire in ${data.expiryMinutes} minutes.</strong></p>` : ''}
    <p>If you did not request this password reset, please ignore this email.</p>
  `);

  const text = `
Password Reset Request

Hello ${data.name},

You have requested to reset your password. Please click the link below to reset it:

${data.resetLink}

${data.expiryMinutes ? `This link will expire in ${data.expiryMinutes} minutes.` : ''}

If you did not request this password reset, please ignore this email.
  `;

  return { html, text };
}

/**
 * Welcome email template
 */
export function welcomeTemplate(data: WelcomeTemplateData): { html: string; text: string } {
  const html = baseTemplate(`
    <h2>Welcome to App 2026!</h2>
    <p>Hello ${data.name},</p>
    <p>Thank you for joining us! We're excited to have you on board.</p>
    ${data.loginLink ? `
      <div style="text-align: center;">
        <a href="${data.loginLink}" class="button">Get Started</a>
      </div>
    ` : ''}
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>Best regards,<br>The App 2026 Team</p>
  `);

  const text = `
Welcome to App 2026!

Hello ${data.name},

Thank you for joining us! We're excited to have you on board.

${data.loginLink ? `Get started here: ${data.loginLink}` : ''}

If you have any questions, feel free to reach out to our support team.

Best regards,
The App 2026 Team
  `;

  return { html, text };
}

/**
 * Email verification template
 */
export function emailVerificationTemplate(data: EmailVerificationTemplateData): { html: string; text: string } {
  const html = baseTemplate(`
    <h2>Verify Your Email Address</h2>
    <p>Hello ${data.name},</p>
    <p>Please verify your email address by clicking the button below:</p>
    <div style="text-align: center;">
      <a href="${data.verificationLink}" class="button">Verify Email</a>
    </div>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all;">${data.verificationLink}</p>
    ${data.expiryMinutes ? `<p><strong>This link will expire in ${data.expiryMinutes} minutes.</strong></p>` : ''}
    <p>If you did not create an account, please ignore this email.</p>
  `);

  const text = `
Verify Your Email Address

Hello ${data.name},

Please verify your email address by clicking the link below:

${data.verificationLink}

${data.expiryMinutes ? `This link will expire in ${data.expiryMinutes} minutes.` : ''}

If you did not create an account, please ignore this email.
  `;

  return { html, text };
}

/**
 * Generic notification email template
 */
export function notificationTemplate(
  title: string,
  message: string,
  actionLink?: string,
  actionText?: string
): { html: string; text: string } {
  const html = baseTemplate(`
    <h2>${title}</h2>
    <p>${message}</p>
    ${actionLink && actionText ? `
      <div style="text-align: center;">
        <a href="${actionLink}" class="button">${actionText}</a>
      </div>
    ` : ''}
  `);

  const text = `
${title}

${message}

${actionLink && actionText ? `${actionText}: ${actionLink}` : ''}
  `;

  return { html, text };
}

