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
import { and, eq } from 'drizzle-orm';
import { broker } from '@/db/schemas/broker-db-schema';
import { user } from '@/db/schemas/user-db-schema';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';

export const regAgent = async (body: agentApplyFormInput) => {
    try {
        const session = await requireSession();

        const parseBody = agentApplyFormSchema.parse(body);

        const [createAgent] = await db
            .insert(agent)
            .values({
                userId: session.user.id,
                ...parseBody,
                brokerId: parseBody.broker,
                brokerRole: parseBody.broker_role,
            })
            .returning({ id: agent.id });

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
