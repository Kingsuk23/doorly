import { db } from '@/db';
import { agent } from '@/db/schemas/agent-db-schema';
import { ok } from '@/lib/api/result';
import { requireSession } from '@/lib/auth/require-session';
import { pusher } from '@/lib/pusher/pusher';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const session = await requireSession();

        const body = await req.text();
        const params = new URLSearchParams(body);
        const socketId = params.get('socket_id')!;
        const channel = params.get('channel_name')!;
        if (!socketId || !channel) {
            return new Response('Bad request', { status: 400 });
        }

        const [myAgent] = await db
            .select({ id: agent.id })
            .from(agent)
            .where(eq(agent.userId, session.user.id))
            .limit(1);

        if (!myAgent || channel !== `private-agent-${myAgent.id}`) {
            return new Response('Forbidden', { status: 403 });
        }

        return ok(pusher.authorizeChannel(socketId, channel));
    } catch {
        return new Response('Unauthorized', { status: 401 });
    }
}
