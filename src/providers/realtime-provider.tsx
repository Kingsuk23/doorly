'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth/auth-client';
import { pusherClient } from '@/lib/pusher/pusher-client';
import { inviteKeys } from '@/features/invities/queries/use-invite';

type EventPayload = { inviteId?: string; propertyId?: string };

type Ctx = { queryClient: QueryClient; refresh: () => void };

const invalidateInvites = ({ queryClient }: Ctx, payload?: EventPayload) => {
    queryClient.invalidateQueries({ queryKey: inviteKeys.mine });

    if (payload?.propertyId) {
        queryClient.invalidateQueries({
            queryKey: inviteKeys.agentSearch(payload.propertyId),
        });
        queryClient.invalidateQueries({
            queryKey: inviteKeys.propertyAgents(payload.propertyId),
        });
    }
};

const handlers: Record<string, (ctx: Ctx, payload?: EventPayload) => void> = {
    'invite:new': (ctx, p) => {
        invalidateInvites(ctx, p);
        ctx.refresh();
    },
    'invite:accepted': (ctx, p) => {
        invalidateInvites(ctx, p);
        ctx.refresh();
    },
    'invite:declined': (ctx, p) => {
        invalidateInvites(ctx, p);
        ctx.refresh();
    },
    'invite:removed': (ctx, p) => {
        invalidateInvites(ctx, p);
        ctx.refresh();
    },
    'invite:approved': (ctx, p) => {
        invalidateInvites(ctx, p);
        ctx.refresh();
    },
    'listing:remove': (ctx, p) => {
        ctx.queryClient.invalidateQueries({ queryKey: ['agent-listings'] });
        invalidateInvites(ctx, p);
        ctx.refresh();
    },
};

export const RealtimeProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = authClient.useSession();
    const queryClient = useQueryClient();
    const router = useRouter();
    const userId = session?.user.id;

    useEffect(() => {
        if (!userId) return;

        const channelName = `private-user-${userId}`;
        const channel = pusherClient.subscribe(channelName);
        const ctx: Ctx = { queryClient, refresh: () => router.refresh() };

        const bound = Object.entries(handlers).map(([event, handler]) => {
            const cb = (payload?: EventPayload) => handler(ctx, payload);
            channel.bind(event, cb);
            return [event, cb] as const;
        });

        return () => {
            bound.forEach(([event, cb]) => channel.unbind(event, cb));
            pusherClient.unsubscribe(channelName);
        };
    }, [userId, queryClient, router]);

    return <>{children}</>;
};
