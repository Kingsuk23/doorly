'use server';

import { db } from '@/db';
import { agent } from '@/db/schemas/agent-db-schema';
import { listing } from '@/db/schemas/listing-db-schema';
import { propertyAgentInvite } from '@/db/schemas/property-agent-invite-db-schema';
import { propertyMember } from '@/db/schemas/property-member-db-schema';
import { handleError } from '@/lib/api/response';
import { AppError, ok } from '@/lib/api/result';
import { requireSession } from '@/lib/auth/require-session';
import { inngest, invitePush } from '@/lib/inngest/inngest-client';
import { pusher } from '@/lib/pusher/pusher';
import { and, eq, gt } from 'drizzle-orm';

export const getMyInvites = async () => {
    try {
        const session = await requireSession();

        const [myAgent] = await db
            .select({ userId: agent.userId })
            .from(agent)
            .where(eq(agent.userId, session.user.id))
            .limit(1);

        if (!myAgent) return ok([]);

        const invites = await db.query.propertyAgentInvite.findMany({
            where: { agentUserId: myAgent.userId, status: 'pending' },
            with: {
                property: {
                    with: {
                        address: { with: { city: { with: { state: true } } } },
                        propertyType: true,
                    },
                },

                owner: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return ok(invites);
    } catch (error) {
        return handleError(error);
    }
};

export const createInvite = async ({
    agentUserId,
    propertyId,
    message,
}: {
    agentUserId: string;
    propertyId: string;
    message?: string;
}) => {
    try {
        const session = await requireSession();

        if (!agentUserId || !propertyId) {
            throw new AppError(
                'BAD_REQUEST',
                'agentId and propertyId are required',
            );
        }

        const [invite] = await db.transaction(async (tx) => {
            const pushInvite = await tx
                .insert(propertyAgentInvite)
                .values({
                    agentUserId,
                    ownerId: session.user.id,
                    propertyId,
                    message,
                })
                .returning({ id: propertyAgentInvite.id });

            await tx.insert(propertyMember).values({
                propertyId,
                role: 'agent',
                status: 'pending',
                userId: agentUserId,
            });

            return pushInvite;
        });

        const results = await Promise.allSettled([
            inngest.send(invitePush.create({ inviteId: invite.id })),
            pusher.trigger(`private-user-${agentUserId}`, 'invite:new', {
                inviteId: invite.id,
            }),
        ]);

        results.forEach((r, i) => {
            if (r.status === 'rejected')
                console.error(`push task ${i} failed:`, r.reason);
        });

        return ok(invite);
    } catch (error) {
        return handleError(error);
    }
};

export const declineInvite = async ({ propertyId }: { propertyId: string }) => {
    try {
        const session = await requireSession();

        if (!propertyId) {
            throw new AppError('BAD_REQUEST', 'propertyId are required');
        }

        const invite = await db.transaction(async (tx) => {
            const [inviteData] = await tx
                .delete(propertyAgentInvite)
                .where(
                    and(
                        eq(propertyAgentInvite.propertyId, propertyId),
                        eq(propertyAgentInvite.agentUserId, session.user.id),
                        eq(propertyAgentInvite.status, 'pending'),
                    ),
                )
                .returning({
                    id: propertyAgentInvite.id,
                    ownerId: propertyAgentInvite.ownerId,
                });
            if (!inviteData) return null;
            await tx
                .delete(propertyMember)
                .where(
                    and(
                        eq(propertyMember.propertyId, propertyId),
                        eq(propertyMember.userId, session.user.id),
                        eq(propertyMember.role, 'agent'),
                        eq(propertyMember.status, 'pending'),
                    ),
                );

            return inviteData;
        });

        if (!invite) throw new AppError('NOT_FOUND', 'Invite not found');

        const results = await Promise.allSettled([
            pusher.trigger(
                `private-user-${invite.ownerId}`,
                'invite:declined',
                {
                    inviteId: invite.id,
                    propertyId,
                },
            ),
            pusher.trigger(
                `private-user-${session.user.id}`,
                'invite:removed',
                {
                    inviteId: invite.id,
                },
            ),
        ]);

        results.forEach((r, i) => {
            if (r.status === 'rejected')
                console.error(`push task ${i} failed:`, r.reason);
        });

        return ok(invite);
    } catch (error) {
        return handleError(error);
    }
};

export const acceptInvite = async ({ propertyId }: { propertyId: string }) => {
    try {
        const session = await requireSession();

        const foundAgent = await db.query.agent.findFirst({
            where: { userId: session.user.id },
        });

        if (!foundAgent) {
            throw new AppError(
                'NOT_FOUND',
                'Agent profile not found for this account.',
            );
        }

        if (!propertyId) {
            throw new AppError('BAD_REQUEST', 'propertyId are required');
        }

        const [isExist] = await db
            .select({
                id: propertyAgentInvite.id,
                expiresAt: propertyAgentInvite.expiresAt,
            })
            .from(propertyAgentInvite)
            .where(
                and(
                    eq(propertyAgentInvite.propertyId, propertyId),
                    eq(propertyAgentInvite.agentUserId, session.user.id),
                    eq(propertyAgentInvite.status, 'pending'),
                ),
            )
            .limit(1);

        if (!isExist) throw new AppError('NOT_FOUND', 'Invite not found');

        if (isExist.expiresAt <= new Date()) {
            throw new AppError('BAD_REQUEST', 'This invite has expired');
        }

        const invite = await db.transaction(async (tx) => {
            const [inviteData] = await tx
                .update(propertyAgentInvite)
                .set({ status: 'accepted', respondedAt: new Date() })
                .where(
                    and(
                        eq(propertyAgentInvite.propertyId, propertyId),
                        eq(propertyAgentInvite.agentUserId, session.user.id),
                        eq(propertyAgentInvite.status, 'pending'),
                    ),
                )
                .returning({
                    id: propertyAgentInvite.id,
                    ownerId: propertyAgentInvite.ownerId,
                });
            if (!inviteData) return null;
            await tx
                .update(propertyMember)
                .set({ status: 'approved' })
                .where(
                    and(
                        eq(propertyMember.propertyId, propertyId),
                        eq(propertyMember.userId, session.user.id),
                        eq(propertyMember.role, 'agent'),
                        eq(propertyMember.status, 'pending'),
                    ),
                );
            await db.insert(listing).values({
                agentId: foundAgent.id,
                propertyId,
            });
            return inviteData;
        });

        if (!invite) throw new AppError('NOT_FOUND', 'Invite not found');

        await Promise.allSettled([
            pusher.trigger(
                `private-user-${invite.ownerId}`,
                'invite:accepted',
                {
                    inviteId: invite.id,
                    propertyId,
                },
            ),
            pusher.trigger(
                `private-user-${session.user.id}`,
                'invite:approved',
                {
                    inviteId: invite.id,
                },
            ),
        ]);

        return ok(invite);
    } catch (error) {
        return handleError(error);
    }
};
