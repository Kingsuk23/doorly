'use server';

import { db } from '@/db';
import { listing } from '@/db/schemas/listing-db-schema';
import { propertyAgentInvite } from '@/db/schemas/property-agent-invite-db-schema';
import { propertyMember } from '@/db/schemas/property-member-db-schema';
import { user } from '@/db/schemas/user-db-schema';
import { handleError } from '@/lib/api/response';
import { AppError, ok } from '@/lib/api/result';
import { auth } from '@/lib/auth/auth';
import { requireSession } from '@/lib/auth/require-session';
import { pusher } from '@/lib/pusher/pusher';
import { and, eq, ne } from 'drizzle-orm';
import { headers } from 'next/headers';

export const cratePropertyMember = async ({
    propertyId,
}: {
    propertyId: string;
}) => {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) throw new AppError('UNAUTHORIZED', 'Please sign in');

        const [createdPropertyMember] = await db
            .insert(propertyMember)
            .values({
                userId: session.user.id,
                propertyId,
            })
            .onConflictDoNothing()
            .returning();

        if (!createdPropertyMember) {
            throw new AppError(
                'INTERNAL_ERROR',
                'Failed to add you to this property',
            );
        }

        return ok(createdPropertyMember);
    } catch (error) {
        return handleError(error);
    }
};

export const getPropertyAgents = async (propertyId: string) => {
    try {
        const session = await requireSession();

        const [membership] = await db
            .select({ id: propertyMember.id })
            .from(propertyMember)
            .where(
                and(
                    eq(propertyMember.propertyId, propertyId),
                    eq(propertyMember.userId, session.user.id),
                    ne(propertyMember.status, 'revoked'),
                ),
            )
            .limit(1);
        if (!membership) throw new Error('Not allowed');

        const agents = await db
            .select({
                memberId: propertyMember.id,
                userId: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                status: propertyMember.status,
            })
            .from(propertyMember)
            .innerJoin(user, eq(user.id, propertyMember.userId))
            .where(
                and(
                    eq(propertyMember.propertyId, propertyId),
                    eq(propertyMember.role, 'agent'),
                    ne(propertyMember.status, 'revoked'),
                ),
            );

        return ok(agents);
    } catch (error) {
        return handleError(error);
    }
};

export const removePropertyAgent = async (
    agentUserId: string,
    memberId: string,
    propertyId: string,
) => {
    try {
        const session = await requireSession();

        const [membership] = await db
            .select({ id: propertyMember.id })
            .from(propertyMember)
            .where(
                and(
                    eq(propertyMember.propertyId, propertyId),
                    eq(propertyMember.userId, session.user.id),
                    ne(propertyMember.status, 'revoked'),
                ),
            )
            .limit(1);
        if (!membership) throw new Error('Not allowed');

        const invite = await db.transaction(async (tx) => {
            await tx
                .delete(propertyMember)
                .where(
                    and(
                        eq(propertyMember.id, memberId),
                        eq(propertyMember.propertyId, propertyId),
                        eq(propertyMember.role, 'agent'),
                    ),
                );

            const [deleteInviteData] = await tx
                .delete(propertyAgentInvite)
                .where(
                    and(
                        eq(propertyAgentInvite.agentUserId, agentUserId),
                        eq(propertyAgentInvite.ownerId, session.user.id),
                        eq(propertyAgentInvite.propertyId, propertyId),
                    ),
                )
                .returning({
                    agentUserid: propertyAgentInvite.agentUserId,
                    id: propertyAgentInvite.id,
                });

            await tx
                .delete(listing)
                .where(
                    and(
                        eq(listing.propertyId, propertyId),
                        eq(listing.agentId, agentUserId),
                    ),
                );

            return deleteInviteData;
        });

        await Promise.allSettled([
            await pusher.trigger(
                `private-user-${invite.agentUserid}`,
                'invite:remove',
                {
                    inviteId: invite.id,
                },
            ),
            pusher.trigger(
                `private-user-${invite.agentUserid}`,
                'listing:remove',
                {
                    inviteId: invite.id,
                    propertyId,
                },
            ),
        ]);
        return ok(true);
    } catch (error) {
        return handleError(error);
    }
};
