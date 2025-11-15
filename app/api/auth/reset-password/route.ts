import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { hashPassword } from '@/app/lib/auth';
import { applyRateLimit, RateLimitPresets, secureLog } from '@/app/lib/security';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be 100 characters or less')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await applyRateLimit(request, RateLimitPresets.AUTH);
  if (!rateLimitResult.success) {
    secureLog('[SECURITY] Password reset confirmation rate limit exceeded');
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // Find the password reset token
    const passwordReset = await prisma.passwordReset.findUnique({
      where: { token },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    // Validate token exists
    if (!passwordReset) {
      secureLog('[AUTH] Invalid password reset token attempted');
      return NextResponse.json(
        { error: 'Invalid or expired reset link. Please request a new one.' },
        { status: 400 }
      );
    }

    // Validate token hasn't been used
    if (passwordReset.used) {
      secureLog('[AUTH] Used password reset token attempted', {
        userId: passwordReset.userId,
      });
      return NextResponse.json(
        { error: 'This reset link has already been used. Please request a new one.' },
        { status: 400 }
      );
    }

    // Validate token hasn't expired
    if (passwordReset.expiresAt < new Date()) {
      secureLog('[AUTH] Expired password reset token attempted', {
        userId: passwordReset.userId,
      });
      return NextResponse.json(
        { error: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const passwordHash = await hashPassword(password);

    // Update user password and mark token as used in a transaction
    await prisma.$transaction([
      // Update user password
      prisma.user.update({
        where: { id: passwordReset.userId },
        data: { passwordHash },
      }),
      // Mark token as used
      prisma.passwordReset.update({
        where: { id: passwordReset.id },
        data: { used: true },
      }),
    ]);

    secureLog('[AUTH] Password reset successful', {
      userId: passwordReset.userId,
      email: passwordReset.user.email,
    });

    return NextResponse.json({
      message: 'Password reset successfully',
    });
  } catch (error: any) {
    secureLog('[ERROR] Password reset failed', { error: error.message });

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
