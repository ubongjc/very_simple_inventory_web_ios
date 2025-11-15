# Email Configuration for Password Reset

This guide will help you set up email sending for the password reset feature using Gmail or any SMTP provider.

## Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password

# Email Sender Information
EMAIL_FROM_NAME=Rental Inventory
EMAIL_FROM_ADDRESS=your-email@gmail.com

# Application URL (for reset links)
NEXTAUTH_URL=http://localhost:3000
```

## Setup with Gmail

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Follow the prompts to enable 2FA

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select app: **Mail**
3. Select device: **Other (Custom name)**
4. Enter a name like "Rental Inventory App"
5. Click **Generate**
6. Copy the 16-character password (remove spaces)
7. Use this as your `SMTP_PASSWORD` in `.env`

### Step 3: Update .env File

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourname@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop  # Your 16-character app password
EMAIL_FROM_NAME=Your Business Name
EMAIL_FROM_ADDRESS=yourname@gmail.com
NEXTAUTH_URL=http://localhost:3000  # Change to your production URL
```

## Setup with Other Email Providers

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.com
SMTP_PASSWORD=your-mailgun-smtp-password
```

### AWS SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
```

### Outlook/Office 365

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

## Testing Email Configuration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3000/auth/forgot-password

3. Enter your email address and click "Send Reset Link"

4. Check your email inbox (and spam folder) for the password reset email

5. Click the reset link and set a new password

## Troubleshooting

### "Failed to send email" error

**Check:**
- SMTP credentials are correct
- App password (not regular password) for Gmail
- Port 587 is not blocked by firewall
- SMTP_HOST is correct for your provider

**View logs:**
```bash
# Development mode shows SMTP connection status
npm run dev
# Look for: [EMAIL] SMTP Server is ready to send messages
```

### Email not received

**Check:**
- Spam/Junk folder
- Email address is correct
- SMTP user has sending permissions
- Gmail: Ensure "Less secure app access" is NOT needed (use App Passwords instead)

### "SMTP Configuration Error" in logs

This means the SMTP connection failed. Verify:
- `SMTP_HOST` is correct
- `SMTP_PORT` is correct (usually 587 or 465)
- `SMTP_SECURE` is `false` for port 587, `true` for port 465
- Credentials are valid

## Production Deployment

### Vercel

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add all SMTP variables
4. Update `NEXTAUTH_URL` to your production URL:
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```
5. Redeploy your application

### Important Security Notes

- **Never commit `.env` file** to version control
- Use **App Passwords** for Gmail, not your main password
- Consider using a dedicated email service (SendGrid, Mailgun) for production
- Enable rate limiting to prevent email spam (already configured)
- Monitor your email sending limits

## Email Flow

1. User clicks "Forgot Password" → enters email
2. System generates secure random token
3. Token saved to database with 1-hour expiration
4. Email sent with reset link containing token
5. User clicks link → redirected to reset password page
6. User enters new password → token validated
7. Password updated → token marked as used
8. User redirected to sign in

## Rate Limiting

Password reset requests are rate-limited to prevent abuse:
- **5 requests per 15 minutes** per IP address
- Protects against email enumeration attacks
- Always returns success message (doesn't reveal if email exists)

## Security Features

✅ Tokens expire after 1 hour
✅ Tokens can only be used once
✅ Old tokens invalidated when new reset requested
✅ Rate limiting prevents abuse
✅ No email enumeration (always returns same message)
✅ Secure random token generation (32 bytes)
✅ Passwords hashed with bcrypt
✅ Transaction ensures atomicity

## Need Help?

If you encounter issues:
1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with a simple Gmail account first
4. Ensure your email provider allows SMTP access
5. Check firewall/network restrictions on SMTP ports
