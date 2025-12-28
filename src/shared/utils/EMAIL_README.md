# Email Service Documentation

## Overview

The email service is a shared utility that can be used throughout the application to send emails. It uses nodemailer and supports HTML and plain text emails with templates.

## Installation

After adding the email service, install the required dependencies:

```bash
npm install
```

This will install `nodemailer` and `@types/nodemailer`.

## Configuration

Add the following environment variables to your `.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@example.com
EMAIL_FROM_NAME=App 2026
```

### Gmail Setup

For Gmail, you'll need to:
1. Enable 2-Step Verification
2. Generate an App Password
3. Use the App Password as `SMTP_PASS`

## Usage

### Basic Usage

```typescript
import { emailService } from '../shared/utils/email.service';

// Send a simple text email
await emailService.sendTextEmail(
  'user@example.com',
  'Subject',
  'Plain text message'
);

// Send an HTML email
await emailService.sendHtmlEmail(
  'user@example.com',
  'Subject',
  '<h1>HTML Content</h1>'
);

// Send email with both HTML and text
await emailService.sendEmailWithBoth(
  'user@example.com',
  'Subject',
  '<h1>HTML Content</h1>',
  'Plain text fallback'
);
```

### Using Templates

```typescript
import { emailService } from '../shared/utils/email.service';
import { passwordResetTemplate } from '../shared/utils/email.templates';

// Send password reset email
const template = passwordResetTemplate({
  name: 'John Doe',
  resetLink: 'https://example.com/reset?token=abc123',
  expiryMinutes: 30,
});

await emailService.sendEmailWithBoth(
  'user@example.com',
  'Password Reset Request',
  template.html,
  template.text
);
```

### Available Templates

1. **passwordResetTemplate** - For password reset emails
2. **welcomeTemplate** - For welcome emails
3. **emailVerificationTemplate** - For email verification
4. **notificationTemplate** - For generic notifications

### Advanced Usage

```typescript
import { emailService } from '../shared/utils/email.service';

// Send email with attachments
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Document',
  text: 'Please find attached document',
  attachments: [
    {
      filename: 'document.pdf',
      path: '/path/to/document.pdf',
    },
  ],
});

// Send to multiple recipients
await emailService.sendEmail({
  to: ['user1@example.com', 'user2@example.com'],
  subject: 'Bulk Email',
  html: '<p>Message</p>',
  cc: 'cc@example.com',
  bcc: 'bcc@example.com',
});
```

### Verify Connection

```typescript
import { emailService } from '../shared/utils/email.service';

// Check if email service is configured and working
const isConnected = await emailService.verifyConnection();
if (!isConnected) {
  console.error('Email service not configured');
}
```

## Examples

See `email.example.ts` for complete usage examples including:
- Password reset emails
- Welcome emails
- Email verification
- Custom HTML emails
- Bulk emails
- Emails with attachments

## Error Handling

The email service logs errors automatically. Methods return `true` on success and `false` on failure:

```typescript
const success = await emailService.sendTextEmail(
  'user@example.com',
  'Subject',
  'Message'
);

if (!success) {
  // Handle error
  console.error('Failed to send email');
}
```

## Notes

- The email service is a singleton, so it's initialized once and reused
- If SMTP credentials are not configured, the service will log a warning but won't throw errors
- All emails are logged for debugging purposes
- The service supports both development and production environments

