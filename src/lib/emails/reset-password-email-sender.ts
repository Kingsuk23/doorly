import ResetPasswordEmail from '@/components/email/auth/reset-password-email';
import { transporter } from '../nodemailer';
import { render } from 'react-email';

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
    const html = await render(
        ResetPasswordEmail({ resetUrl, name, expiresInMinutes }),
    );

    const { error } = await transporter.sendMail({
        from: 'doorly <noreply@doorly.com>',
        to,
        subject: 'Reset password',
        html,
    });

    if (error) {
        console.error('[password] Reset failed', error);
        throw new Error('Failed to send reset password email');
    }
};
