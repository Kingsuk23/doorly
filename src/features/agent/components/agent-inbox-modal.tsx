'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { InviteCardSkeleton } from '@/features/invities/components/skeleton/invite-card-skeleton';
import { useMyInvites } from '@/features/invities/queries/use-invite';
import { Inbox } from 'lucide-react';
import { useEffect } from 'react';
import AgentInboxItem from './agent-inbox-item';
import { useQueryClient } from '@tanstack/react-query';
import { pusherClient } from '@/lib/pusher/pusher-client';
import { Badge } from '@/components/ui/badge';

interface AgentInboxModalProps {
    userId: string | undefined;
}

const AgentInboxModal = ({ userId }: AgentInboxModalProps) => {
    const queryClient = useQueryClient();
    const { data: inbox, isPending } = useMyInvites();

    useEffect(() => {
        if (inbox && !inbox.success) {
            toast.add({
                type: 'error',
                description: inbox.error.message,
            });
        }
    }, [inbox]);

    const inboxData = inbox?.success ? inbox.data : [];

    useEffect(() => {
        if (!userId) return;

        const channelName = `private-user-${userId}`;
        const channel = pusherClient.subscribe(channelName);

        const refresh = () =>
            queryClient.invalidateQueries({ queryKey: ['my_invites'] });

        channel.bind('invite:new', refresh);
        channel.bind('invite:removed', refresh);

        return () => {
            channel.unbind('invite:new', refresh);
            channel.unbind('invite:removed', refresh);
            pusherClient.unsubscribe(channelName);
        };
    }, [userId, queryClient]);

    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
                <Inbox /> Listing requests
                {inboxData.length >= 1 && (
                    <Badge variant="destructive">{inboxData.length}</Badge>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Inbox</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 max-h-95 overflow-y-auto scroll-container">
                    {isPending &&
                        Array.from({ length: 5 }).map((_, idx) => (
                            <InviteCardSkeleton key={idx} />
                        ))}

                    {!isPending && inboxData.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
                            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
                                <Inbox className="size-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">
                                No listing requests yet
                            </p>
                            <p className="max-w-xs text-xs text-muted-foreground">
                                When a property owner invites you to manage
                                their listing, the request will show up here.
                            </p>
                        </div>
                    )}

                    {inboxData.map((item) => {
                        const fullAddress = `${item.property.address?.streetLine1},${item.property?.address?.city?.name},${item.property.address?.city?.state?.name}`;

                        return (
                            <AgentInboxItem
                                key={item.id}
                                avatar={item.owner.image}
                                area={item.property.livingAreaSqft}
                                bathrooms={item.property.bathrooms}
                                bedrooms={item.property.bedrooms}
                                city={item.property.address?.city?.name}
                                createdAt={item.createdAt}
                                expireDate={item.expiresAt}
                                fullAddress={fullAddress}
                                message={item.message}
                                id={item.id}
                                name={item.owner.name}
                                propertyType={item.property?.propertyType?.name}
                                yearBuilt={item.property.yearBuilt}
                                propertyId={item.property.id}
                            />
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AgentInboxModal;
