import { resend } from '../resend-config';
import EmailVerification from '@/components/email/auth/email-verification';

type SendVerificationEmailParams = {
    to: string;
    name?: string;
    verifyUrl: string;
};

export const sendVerificationEmail = async ({
    to,
    name,
    verifyUrl,
}: SendVerificationEmailParams) => {
    const { error } = await resend.emails.send({
        from: 'doorly <onboarding@resend.dev>',
        to,
        subject: 'Verify your email',
        react: EmailVerification({ verifyUrl, name }),
    });

    if (error) {
        console.error('[email] verification failed', error);
        throw new Error('Failed to send verification email');
    }
};
