import ResetPasswordEmail from '@/components/email/auth/reset-password-email';
import { resend } from '../resend-config';

type resetPasswordEmailSenderParams = {
    to: string;
    name?: string;
    resetUrl: string;
    expiresInMinutes?: number;
};

export const resetPasswordEmailSender = async ({
    to,
    name,
    resetUrl,
    expiresInMinutes,
}: resetPasswordEmailSenderParams) => {
    const { error } = await resend.emails.send({
        from: 'doorly <onboarding@resend.dev>',
        to,
        subject: 'Verify your email',
        react: ResetPasswordEmail({ resetUrl, name, expiresInMinutes }),
    });

    if (error) {
        console.error('[password] Reset failed', error);
        throw new Error('Failed to send reset password email');
    }
};
