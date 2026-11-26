import { db } from '@/db';
import { inngest, invitePush } from './inngest-client';
import { agentInviteEmailSender } from '../emails/send-agent-invite-email';
import { dateFormatter } from '../date-formatter';

export const sendAgentInviteEmail = inngest.createFunction(
    {
        id: 'send-agent-invite-email',
        retries: 3,
        triggers: [invitePush],
    },
    async ({ event, step }) => {
        const { inviteId } = event.data;

        const invite = await step.run('load-invite', () => {
            return db.query.propertyAgentInvite.findFirst({
                where: { id: inviteId },
                with: {
                    property: {
                        with: {
                            propertyType: true,
                            address: {
                                with: { city: { with: { state: true } } },
                            },
                        },
                    },
                    agentUser: true,
                    owner: true,
                },
            });
        });

        if (!invite || invite.status !== 'pending') return;

        const agentEmail = invite.agentUser?.email;
        if (!agentEmail) return;

        const address = invite.property.address;
        const city = address?.city;

        const propertyLabel = [
            invite.property.propertyType?.name,
            city && `in ${city.name}`,
        ]
            .filter(Boolean)
            .join(' ');

        const propertyAddress = [
            address?.streetLine1,
            city?.name,
            city?.state?.name,
        ]
            .filter(Boolean)
            .join(', ');

        await step.run('send-email', () =>
            agentInviteEmailSender({
                to: agentEmail,
                agentName: invite.agentUser?.name,
                ownerName: invite.owner.name,
                propertyLabel,
                propertyAddress,
                ownerMessage: invite.message ?? undefined,
                expiryDate: dateFormatter.format(new Date(invite.expiresAt)),
                logoUrl: `${invite.owner.image}`,
            }),
        );
    },
);
