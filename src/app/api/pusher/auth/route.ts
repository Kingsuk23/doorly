import { requireSession } from '@/lib/auth/require-session';
import { pusher } from '@/lib/pusher/pusher';
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

        if (channel !== `private-user-${session.user.id}`) {
            return new Response('Forbidden', { status: 403 });
        }
        const authResponse = pusher.authorizeChannel(socketId, channel);
        return Response.json(authResponse);
    } catch {
        return new Response('Unauthorized', { status: 401 });
    }
}
