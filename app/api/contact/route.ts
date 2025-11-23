import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { apiRateLimiter, getClientIp, applyRateLimit } from '@/app/lib/ratelimit';
import { sanitizeString } from '@/app/lib/security';
import { sendEmail } from '@/app/lib/email';
import { z } from 'zod';

// Validation schema for contact form
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .min(3, 'Email must be at least 3 characters')
    .max(254, 'Email must be less than 254 characters')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(150, 'Message must be 150 characters or less'),
  // Honeypot field to catch bots
  website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting: 3 contact form submissions per hour per IP
    const clientIp = getClientIp(request);
    const rateLimitResult = await applyRateLimit(apiRateLimiter, `contact:${clientIp}`);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many contact form submissions. Please try again in an hour.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '3',
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
            'X-RateLimit-Reset': rateLimitResult.reset?.toString() || '',
          },
        }
      );
    }

    const body = await request.json();

    console.log('[CONTACT] Received body:', JSON.stringify({
      name: body.name ? 'present' : 'missing',
      email: body.email ? 'present' : 'missing',
      phone: body.phone !== undefined ? 'present' : 'missing',
      subject: body.subject ? 'present' : 'missing',
      message: body.message ? 'present' : 'missing',
      website: body.website !== undefined ? 'present' : 'missing',
    }));

    // Check honeypot field - if filled, it's likely a bot
    if (body.website) {
      console.log('[SECURITY] Honeypot triggered for contact form');
      // Return success to not alert the bot, but don't actually process
      return NextResponse.json(
        {
          success: true,
          message: "Your message has been received. We'll contact you soon!",
        },
        { status: 200 }
      );
    }

    // Validate input
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      console.error('[CONTACT] Validation failed:', {
        field: firstError.path.join('.'),
        message: firstError.message,
        code: firstError.code,
      });
      console.error('[CONTACT] All errors:', validationResult.error.errors);
      return NextResponse.json(
        { error: firstError.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validationResult.data;

    // Sanitize inputs to prevent XSS
    const sanitizedData = {
      name: sanitizeString(name),
      email: sanitizeString(email.toLowerCase().trim()),
      phone: phone ? sanitizeString(phone) : '',
      subject: sanitizeString(subject),
      message: sanitizeString(message),
    };

    // Additional email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedData.email)) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
    }

    // Send email notification to support team
    const supportEmail = process.env.SUPPORT_EMAIL || 'support@verysimpleinventory.com';

    try {
      // Check if SMTP is configured
      const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
      console.log('[CONTACT] SMTP configured:', smtpConfigured);
      console.log('[CONTACT] SMTP_USER exists:', !!process.env.SMTP_USER);
      console.log('[CONTACT] SMTP_PASSWORD exists:', !!process.env.SMTP_PASSWORD);

      // Only send email if SMTP is configured
      if (smtpConfigured) {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.5; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
                .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 20px; }
                .header h2 { margin: 0; font-size: 18px; }
                .content { padding: 20px; }
                .reply-btn { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0 20px 0; }
                .reply-btn:hover { background: #5568d3; }
                .field { margin-bottom: 12px; }
                .label { font-weight: bold; color: #555; font-size: 12px; text-transform: uppercase; }
                .value { margin-top: 4px; padding: 8px 12px; background: #f8f9fa; border-radius: 4px; border-left: 3px solid #667eea; }
                .footer { padding: 16px 20px; background: #f8f9fa; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>📧 New Contact Message</h2>
                </div>
                <div class="content">
                  <a href="mailto:${sanitizedData.email}?subject=Re: ${encodeURIComponent(sanitizedData.subject)}" class="reply-btn">
                    ↩️ Reply to ${sanitizedData.name}
                  </a>

                  <div class="field">
                    <div class="label">From</div>
                    <div class="value">${sanitizedData.name} (${sanitizedData.email})</div>
                  </div>

                  <div class="field">
                    <div class="label">Message</div>
                    <div class="value">${sanitizedData.message.replace(/\n/g, '<br>')}</div>
                  </div>

                  <div class="footer">
                    Received: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos', timeZoneName: 'short' })}
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;

        const emailText = `
New Contact Message

From: ${sanitizedData.name} (${sanitizedData.email})

Message:
${sanitizedData.message}

---
Received: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos', timeZoneName: 'short' })}

Reply to this email to respond to ${sanitizedData.name}.
        `;

        await sendEmail({
          to: supportEmail,
          subject: `Contact Form: ${sanitizedData.subject}`,
          html: emailHtml,
          text: emailText,
        });

        console.log('[CONTACT] Email sent successfully to support team');
      } else {
        // Log to console if email is not configured
        console.log('[CONTACT] Email not configured. Contact form submission:', {
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (emailError) {
      // Log detailed email error
      console.error('[CONTACT] Failed to send email notification:', emailError);
      if (emailError instanceof Error) {
        console.error('[CONTACT] Error message:', emailError.message);
        console.error('[CONTACT] Error stack:', emailError.stack);
      }
      // We don't want to fail the request just because email failed
      // The support team should monitor logs
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting us! We'll respond within 24 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[CONTACT] Form processing error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}
