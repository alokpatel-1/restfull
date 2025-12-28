# Email Service Troubleshooting Guide

## Common Error: EAUTH - Authentication Failed

### Error Message
```
535-5.7.8 Username and Password not accepted
Code: EAUTH
Response Code: 535
```

### Solution for Gmail

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. **Generate an App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter a name like "App 2026"
   - Copy the generated 16-character password (it will look like: `abcd efgh ijkl mnop`)

3. **Update your .env file**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=abcdefghijklmnop  # Use the App Password (remove spaces)
   ```

4. **Important Notes**
   - Use the **App Password**, NOT your regular Gmail password
   - Remove any spaces from the App Password
   - The App Password is 16 characters without spaces
   - If you lose the App Password, generate a new one

### Solution for Other Email Providers

#### Outlook/Office 365
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password  # Generate at: https://login.yahoo.com/account/security
```

## Other Common Errors

### ECONNECTION - Connection Failed
**Problem**: Cannot connect to SMTP server

**Solutions**:
- Check `SMTP_HOST` is correct
- Check `SMTP_PORT` is correct
- Verify firewall allows outbound connections
- Check if you're behind a corporate proxy

### ETIMEDOUT - Connection Timeout
**Problem**: SMTP server didn't respond in time

**Solutions**:
- Check your internet connection
- Verify SMTP server is accessible
- Try a different SMTP port (587 vs 465)
- Check if your ISP blocks SMTP ports

### Response Code 534 - Authentication Mechanism Not Supported
**Problem**: SMTP server doesn't support the authentication method

**Solutions**:
- Use port 587 with `SMTP_SECURE=false` (TLS)
- Avoid port 465 if you're having issues
- Check your email provider's documentation

## Testing Your Email Configuration

1. **Check if email service is configured**
   - Look for: "Email transporter initialized successfully" in logs
   - If you see: "Email service not configured", check your SMTP credentials

2. **Verify connection**
   - The email service will attempt to verify the connection
   - Check logs for connection errors

3. **Test sending**
   - Register a new user to trigger welcome email
   - Check logs for detailed error messages
   - The service now provides helpful hints for common errors

## Quick Checklist

- [ ] 2-Step Verification enabled (Gmail)
- [ ] App Password generated (Gmail)
- [ ] `SMTP_USER` is your full email address
- [ ] `SMTP_PASS` is the App Password (not regular password)
- [ ] `SMTP_PORT` is 587 (or 465 for SSL)
- [ ] `SMTP_SECURE` matches your port (false for 587, true for 465)
- [ ] No spaces in App Password
- [ ] `.env` file is in the project root
- [ ] Restarted server after changing `.env`

## Still Having Issues?

1. **Check the logs** - The email service now provides detailed error messages with hints
2. **Verify credentials** - Double-check your SMTP_USER and SMTP_PASS
3. **Test with a different email provider** - Try Outlook or Yahoo to isolate the issue
4. **Check email provider status** - Some providers have service outages
5. **Review email provider documentation** - Each provider has specific requirements

