# Environment Variables Setup Guide

This document explains all the environment variables needed for the application.

## Quick Start

1. Copy the example file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and fill in your actual values

3. **IMPORTANT**: Never commit your `.env` file to version control!

## Required Variables

### Server Configuration

- **PORT** (default: `3000`)
  - Port number for the server to listen on
  - Example: `3000`, `8080`

- **NODE_ENV** (default: `development`)
  - Environment mode: `development`, `production`, or `test`
  - Affects logging, error messages, and some feature flags

### Database Configuration

- **MONGODB_URI** (required)
  - MongoDB connection string
  - Format: `mongodb://[username:password@]host[:port][/database][?options]`
  - Examples:
    - Local: `mongodb://localhost:27017/app_2026`
    - With auth: `mongodb://user:pass@localhost:27017/app_2026?authSource=admin`
    - Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/app_2026`

### JWT Configuration

- **JWT_SECRET** (required in production)
  - Secret key for signing JWT access tokens
  - **IMPORTANT**: Use a strong random string in production!
  - Generate with: `openssl rand -base64 32`

- **JWT_EXPIRES_IN** (default: `15m`)
  - Access token expiration time
  - Format: `number + unit` (s=seconds, m=minutes, h=hours, d=days)
  - Examples: `15m`, `1h`, `24h`

- **JWT_REFRESH_SECRET** (required in production)
  - Secret key for signing JWT refresh tokens
  - **IMPORTANT**: Use a different strong random string from JWT_SECRET!
  - Generate with: `openssl rand -base64 32`

- **JWT_REFRESH_EXPIRES_IN** (default: `7d`)
  - Refresh token expiration time
  - Format: `number + unit` (s=seconds, m=minutes, h=hours, d=days)
  - Examples: `7d`, `30d`, `90d`

### Email Configuration (SMTP)

These are optional but required if you want to send emails (welcome emails, password resets, etc.).

- **SMTP_HOST** (default: `smtp.gmail.com`)
  - SMTP server hostname
  - Common values:
    - Gmail: `smtp.gmail.com`
    - Outlook: `smtp-mail.outlook.com`
    - Yahoo: `smtp.mail.yahoo.com`
    - Custom: `smtp.yourdomain.com`

- **SMTP_PORT** (default: `587`)
  - SMTP server port
  - `587` for TLS (recommended)
  - `465` for SSL
  - `25` for unencrypted (not recommended)

- **SMTP_SECURE** (default: `false`)
  - Use secure connection (SSL/TLS)
  - `true` for port 465 (SSL)
  - `false` for port 587 (TLS)

- **SMTP_USER** (optional)
  - SMTP username (usually your email address)
  - For Gmail: `your-email@gmail.com`

- **SMTP_PASS** (optional)
  - SMTP password
  - For Gmail: Use an **App Password** (not your regular password)
    - Generate at: https://myaccount.google.com/apppasswords
    - Enable 2-Step Verification first
  - For other providers: Use your email password or app-specific password

- **EMAIL_FROM** (default: `noreply@example.com`)
  - Email address to send from
  - Usually same as SMTP_USER, but can be different if your SMTP server allows it

- **EMAIL_FROM_NAME** (default: `App 2026`)
  - Display name for the sender
  - Example: `App 2026`, `My Company`

### Application Configuration

- **APP_URL** (default: `http://localhost:3000/api`)
  - Base URL of your application (used in email links)
  - Development: `http://localhost:3000/api`
  - Production: `https://yourdomain.com/api`

## Gmail Setup Instructions

If you're using Gmail for sending emails:

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "App 2026" or any name
   - Copy the generated 16-character password

3. **Update .env file**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # The 16-character app password
   ```

## Production Checklist

Before deploying to production, make sure:

- [ ] All required variables are set
- [ ] `JWT_SECRET` is a strong random string
- [ ] `JWT_REFRESH_SECRET` is a different strong random string
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` points to production database
- [ ] `APP_URL` points to production domain
- [ ] SMTP credentials are configured (if using email features)
- [ ] `.env` file is in `.gitignore` (should already be there)

## Security Notes

- **Never commit `.env` files to version control**
- Use strong, random secrets for JWT keys
- Use App Passwords for Gmail (not your regular password)
- Rotate secrets regularly in production
- Use different secrets for different environments

