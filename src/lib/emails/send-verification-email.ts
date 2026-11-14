import { render } from 'react-email';
import EmailVerification from '@/components/email/auth/email-verification';
import { transporter } from '../nodemailer';

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
    const html = await render(EmailVerification({ verifyUrl, name }));

    const { error } = await transporter.sendMail({
        from: 'doorly <noreply@doorly.com>',
        to,
        subject: 'Verify your email',
        html,
    });

    if (error) {
        console.error('[email] verification failed', error);
        throw new Error('Failed to send verification email');
    }
};
