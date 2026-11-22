'use server';

import { db } from '@/db';
import { agent } from '@/db/schemas/agent-db-schema';
import { handleError } from '@/lib/api/response';
import { requireSession } from '@/lib/auth/require-session';
import {
    agentApplyFormInput,
    agentApplyFormSchema,
} from '../schema/agent-zod-schema';
import { ok } from '@/lib/api/result';
import { eq } from 'drizzle-orm';

export const regAgent = async (body: agentApplyFormInput) => {
    try {
        const session = await requireSession();

        const parseBody = agentApplyFormSchema.parse(body);

        const [createAgent] = await db
            .insert(agent)
            .values({
                userId: session.user.id,
                ...parseBody,
            })
            .returning({ id: agent.id });

        return ok(createAgent);
    } catch (error) {
        return handleError(error);
    }
};

export const getAgent = async () => {
    try {
        const session = await requireSession();

        const [foundAgent] = await db
            .select({ id: agent.id })
            .from(agent)
            .where(eq(agent.userId, session.user.id))
            .limit(1);

        return ok(foundAgent ?? null);
    } catch (error) {
        return handleError(error);
    }
};
