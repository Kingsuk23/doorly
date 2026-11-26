import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AgentSearchList from './agent-search-list';
import {
    useGetAssignPropertiesAgents,
    useRemoveAgent,
} from '@/features/properties/queries/use-property-member';
import CurrentAgentItem from './current-agent-item';
import { AgentSearchItemSkeleton } from './skeleton/agent-search-item-skeleton';
import { useRouter } from 'next/navigation';
import { useSlider } from '@/hooks/use-slider';
import { useEffect, useState } from 'react';
import { cn } from 'cn';
import { toast } from '@/components/ui/toast';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import { pusherClient } from '@/lib/pusher/pusher-client';
import { useQueryClient } from '@tanstack/react-query';
import { inviteKeys } from '../queries/use-invite';

interface AgentInviteModalProps {
    propertyId: string;
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const tabs = ['Find agents', 'Assigned agents'];

const AgentInviteModal = ({
    onOpenChange,
    open,
    propertyId,
}: AgentInviteModalProps) => {
    const queryClient = useQueryClient();
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const [currentTabIndex, setCurrenTabIndex] = useState(0);

    const { buttonRefs, indicator, tabRef } = useSlider(currentTabIndex);

    const { data: agentsRes, isPending } =
        useGetAssignPropertiesAgents(propertyId);
    const { mutate, isPending: isRemoving } = useRemoveAgent(propertyId);

    const currentAgents = agentsRes?.success ? agentsRes.data : [];

    const handleRemove = (memberId: string, agentUserId: string) => {
        mutate({ agentUserId, memberId });
        router.refresh();
    };

    useEffect(() => {
        if (agentsRes && !agentsRes.success) {
            toast.add({
                type: 'error',
                description: agentsRes.error.message,
            });
        }
    }, [agentsRes]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite an agent</DialogTitle>
                </DialogHeader>
                <div
                    ref={tabRef}
                    role="tablist"
                    className="relative inline-flex items-center gap-1 rounded-lg bg-muted p-1"
                >
                    <div
                        aria-hidden
                        className="pointer-events-none absolute left-0 top-1 bottom-1 z-0 rounded-md bg-background shadow-sm ring-1 ring-black/5 transition-[transform,width] duration-300 ease-out dark:ring-white/10"
                        style={{
                            width: indicator.width,
                            transform: `translateX(${indicator.left}px)`,
                        }}
                    />

                    {tabs.map((item, idx) => {
                        const isActive = idx === currentTabIndex;

                        return (
                            <button
                                key={item}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                ref={(el) => {
                                    buttonRefs.current[idx] = el;
                                }}
                                onClick={() => setCurrenTabIndex(idx)}
                                className={cn(
                                    'relative z-10 h-8 rounded-md px-4 text-sm font-medium outline-none transition-colors duration-200',
                                    'focus-visible:ring-2 focus-visible:ring-ring',
                                    isActive
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground',
                                    isActive &&
                                        indicator.width === 0 &&
                                        'bg-background shadow-sm',
                                )}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>
                {currentTabIndex === 1 && (
                    <>
                        {isPending &&
                            Array.from({ length: 5 }).map((_, idx) => (
                                <AgentSearchItemSkeleton key={idx} />
                            ))}
                        {currentAgents && currentAgents.length === 0 && (
                            <div className="flex flex-col items-center justify-center gap-1 py-10 text-center">
                                <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted">
                                    <Users className="size-5 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium">
                                    No agents assigned yet
                                </p>
                                <p className="max-w-xs text-xs text-muted-foreground">
                                    Invite an agent to help manage and promote
                                    this property. They will show up here once
                                    they accept.
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-3"
                                    onClick={() => setCurrenTabIndex(0)}
                                >
                                    Find agents
                                </Button>
                            </div>
                        )}
                        {currentAgents &&
                            currentAgents.map((res) => (
                                <CurrentAgentItem
                                    key={res.memberId}
                                    email={res.email}
                                    memberId={res.memberId}
                                    name={res.name}
                                    status={res.status}
                                    image={res.image}
                                    isRemoving={isRemoving}
                                    agentUserId={res.userId}
                                    onRemove={handleRemove}
                                />
                            ))}
                    </>
                )}
                {currentTabIndex === 0 && (
                    <AgentSearchList propertyId={propertyId} />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AgentInviteModal;
