import { db } from '@/db';
import { agent } from '@/db/schemas/agent-db-schema';
import { propertyAgentInvite } from '@/db/schemas/property-agent-invite-db-schema';
import { handleError } from '@/lib/api/response';
import { AppError, ok } from '@/lib/api/result';
import { requireSession } from '@/lib/auth/require-session';
import { inngest } from '@/lib/inngest/inngest-client';
import { pusher } from '@/lib/pusher/pusher';
import { eq } from 'drizzle-orm';

export const getMyInvites = async () => {
    try {
        const session = await requireSession();

        const [myAgent] = await db
            .select({ id: agent.id })
            .from(agent)
            .where(eq(agent.userId, session.user.id))
            .limit(1);

        if (!myAgent) return ok([]);

        const invites = await db.query.propertyAgentInvite.findMany({
            where: { agentId: myAgent.id, status: 'pending' },
            with: { property: true, owner: true },
            orderBy: { createdAt: 'desc' },
        });

        return ok(invites);
    } catch (error) {
        return handleError(error);
    }
};

export const createInvite = async ({
    agentId,
    propertyId,
    message,
}: {
    agentId: string;
    propertyId: string;
    message?: string;
}) => {
    try {
        const session = await requireSession();

        if (!agentId || !propertyId) {
            throw new AppError(
                'BAD_REQUEST',
                'agentId and propertyId are required',
            );
        }

        const [invite] = await db
            .insert(propertyAgentInvite)
            .values({
                agentId,
                ownerId: session.user.id,
                propertyId,
                message,
            })
            .returning({ id: propertyAgentInvite.id });

        await inngest.send({
            name: 'invite/created',
            data: { inviteId: invite.id },
        });

        await pusher.trigger(`private-user-${agentId}`, 'invite:new', {
            inviteId: invite.id,
        });

        return ok(invite);
    } catch (error) {
        return handleError(error);
    }
};
