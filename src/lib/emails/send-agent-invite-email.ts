import { transporter } from '../nodemailer';
import { render } from 'react-email';
import AgentInviteEmail from '@/components/email/invites/agent-invite-email';

type agentInviteEmailSenderParams = {
    ownerName: string;
    propertyLabel: string;
    propertyAddress?: string;
    ownerMessage?: string;
    agentName?: string;
    expiryDate: string;
    logoUrl?: string;
    to: string;
};

export const agentInviteEmailSender = async ({
    expiryDate,
    ownerName,
    propertyLabel,
    agentName,
    logoUrl,
    ownerMessage,
    to,
    propertyAddress,
}: agentInviteEmailSenderParams) => {
    const html = await render(
        AgentInviteEmail({
            expiryDate,
            ownerName,
            propertyLabel,
            agentName,
            logoUrl,
            ownerMessage,
            propertyAddress,
        }),
    );

    const { error } = await transporter.sendMail({
        from: 'doorly <noreply@doorly.com>',
        to,
        subject: 'Agent invite',
        html,
    });

    if (error) {
        console.error('[Agent invite] email send failed', error);
        throw new Error('Failed to send agent invite email');
    }
};
