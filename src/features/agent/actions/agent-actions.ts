'use server';

import { db } from '@/db';
import { agent } from '@/db/schemas/agent-db-schema';
import { handleError } from '@/lib/api/response';
import { requireSession } from '@/lib/auth/require-session';
import {
    agentApplyFormInput,
    agentApplyFormSchema,
    agentInfoUpdateFormInput,
    agentInfoUpdateFormSchema,
} from '../schema/agent-zod-schema';
import { AppError, ok } from '@/lib/api/result';
import { and, eq, ilike, inArray, isNull, notExists, or } from 'drizzle-orm';
import { broker } from '@/db/schemas/broker-db-schema';
import { user } from '@/db/schemas/user-db-schema';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { propertyMember } from '@/db/schemas/property-member-db-schema';
import { properties } from 'zod';
import { propertyAgentInvite } from '@/db/schemas/property-agent-invite-db-schema';

export const regAgent = async (body: agentApplyFormInput) => {
    try {
        const session = await requireSession();

        const parseBody = agentApplyFormSchema.parse(body);

        const createAgent = await db.transaction(async (tx) => {
            const [created] = await tx
                .insert(agent)
                .values({
                    userId: session.user.id,
                    ...parseBody,
                    brokerId: parseBody.broker,
                    brokerRole: parseBody.broker_role,
                })
                .returning({ id: agent.id });

            await tx
                .update(user)
                .set({ role: 'agent' })
                .where(
                    and(
                        eq(user.id, session.user.id),
                        or(isNull(user.role), eq(user.role, 'user')),
                    ),
                );

            return created;
        });

        return ok(createAgent);
    } catch (error) {
        return handleError(error);
    }
};

export const getAgent = async () => {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) return ok(null);

        const [foundAgent] = await db
            .select()
            .from(agent)
            .where(eq(agent.userId, session.user.id))
            .leftJoin(broker, eq(broker.id, agent.brokerId))
            .leftJoin(user, eq(user.id, agent.userId))
            .limit(1);

        return ok(foundAgent ?? null);
    } catch (error) {
        return handleError(error);
    }
};

export const updateAgentInfo = async ({
    body,
    id,
}: {
    body: agentInfoUpdateFormInput;
    id: string;
}) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Agent id is required');

        const session = await requireSession();

        const { avatar, bio, email, phone, website, name } =
            agentInfoUpdateFormSchema.parse(body);

        const updated = await db.transaction(async (tx) => {
            const [updatedAgent] = await tx
                .update(agent)
                .set({ bio, email, phone, website })
                .where(and(eq(agent.userId, session.user.id), eq(agent.id, id)))
                .returning({ id: agent.id });

            if (!updatedAgent) {
                throw new AppError('NOT_FOUND', 'Agent not found');
            }

            await tx
                .update(user)
                .set({ image: avatar?.url, imageId: avatar?.fileId, name })
                .where(eq(user.id, session.user.id));

            return updatedAgent;
        });

        return ok(updated);
    } catch (error) {
        return handleError(error);
    }
};

export const deleteAgent = async ({ id }: { id: string }) => {
    try {
        if (!id) throw new AppError('BAD_REQUEST', 'Agent id is required');
        const session = await requireSession();

        const [deleteAgent] = await db
            .delete(agent)
            .where(and(eq(agent.userId, session.user.id), eq(agent.id, id)))
            .returning({ id: agent.id });

        return ok(deleteAgent);
    } catch (error) {
        return handleError(error);
    }
};

export const getAllAgents = async (query: string, propertyId: string) => {
    try {
        if (!propertyId)
            throw new AppError('BAD_REQUEST', 'Property id is required');

        const q = query?.trim();

        const foundAgents = await db
            .select({
                id: agent.id,
                name: user.name,
                avatar: user.image,
                userId: agent.userId,
                email: user.email,
            })
            .from(agent)
            .leftJoin(user, eq(user.id, agent.userId))
            .leftJoin(broker, eq(broker.id, agent.brokerId))
            .where(
                and(
                    notExists(
                        db
                            .select({ one: propertyMember.id })
                            .from(propertyMember)
                            .where(
                                and(
                                    eq(propertyMember.propertyId, propertyId),
                                    eq(propertyMember.userId, agent.userId),
                                    inArray(propertyMember.status, [
                                        'pending',
                                        'approved',
                                    ]),
                                ),
                            ),
                    ),

                    notExists(
                        db
                            .select({ one: propertyAgentInvite.id })
                            .from(propertyAgentInvite)
                            .where(
                                and(
                                    eq(
                                        propertyAgentInvite.propertyId,
                                        propertyId,
                                    ),
                                    eq(
                                        propertyAgentInvite.agentUserId,
                                        agent.userId,
                                    ),
                                    eq(propertyAgentInvite.status, 'pending'),
                                ),
                            ),
                    ),
                    q
                        ? or(
                              ilike(user.name, `%${query.trim()}%`),
                              ilike(broker.name, `%${query.trim()}%`),
                          )
                        : undefined,
                ),
            )
            .limit(5);

        return ok(foundAgents);
    } catch (error) {
        return handleError(error);
    }
};
