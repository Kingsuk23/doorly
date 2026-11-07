'use server';

import { headers } from 'next/headers';
import { db } from '@/db';
import { agent } from '@/db/schema/agent';
import { auth } from '@/lib/auth';
import { AgentFormValues } from '../schemas/agentApplySchema';
import { eq } from 'drizzle-orm';

export const addAgent = async (raw: AgentFormValues) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;

    try {
        const [created] = await db
            .insert(agent)
            .values({
                userId: session.user.id,
                email: raw.email,
                license: raw.license,
                phone: raw.phone,
                agencyId: raw.agency,
                agencyRole: raw.agencyRole,
                bio: raw.bio || null,
                website: raw.website || null,
            })
            .returning({ id: agent.id });

        return created;
    } catch (e: any) {
        const code = e?.code ?? e?.cause?.code;
        if (code === '23505') {
            throw new Error(
                'You already have an agent profile, or this agency already has an owner.',
            );
        }
        throw e;
    }
};

export const getAgent = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;

    const [found] = await db
        .select({ id: agent.id })
        .from(agent)
        .where(eq(agent.userId, session.user.id))
        .limit(1);

    return found ?? null;
};
