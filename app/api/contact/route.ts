import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { apiRateLimiter, getClientIp, applyRateLimit } from '@/app/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting: 3 contact form submissions per hour per IP
    const clientIp = getClientIp(request);
    const rateLimitResult = await applyRateLimit(apiRateLimiter, `contact:${clientIp}`);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many contact form submissions. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '30',
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
            'X-RateLimit-Reset': rateLimitResult.reset?.toString() || '',
          },
        }
      );
    }

    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Store contact inquiry in database
    // We'll create a ContactInquiry model for this
    // For now, we can store it in a generic way or log it

    // TODO: Implement email notification to admin
    // For production, you would send an email here using a service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Nodemailer with SMTP

    console.error('Contact form submission:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received. We'll contact you soon!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to process contact form' }, { status: 500 });
  }
}
