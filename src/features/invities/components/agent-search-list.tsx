import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';
import { useGetAllAgent } from '@/features/agent/quriues/agent-quires';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import AgentSearchItem from './agent-search-item';
import { AgentSearchItemSkeleton } from './skeleton/agent-search-item-skeleton';
import { usePushInvites } from '../queries/use-invite';
import { useRouter } from 'next/navigation';
import { UserSearch } from 'lucide-react';

interface AgentSearchListProps {
    propertyId: string;
}

const AgentSearchList = ({ propertyId }: AgentSearchListProps) => {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState('');

    const [searchValue] = useDebounce(searchInput.trim(), 300);

    const { isPending, data: result } = useGetAllAgent(searchValue, propertyId);
    const {
        mutate,
        isPending: isPushing,
        variables: invitingAgentId,
    } = usePushInvites(propertyId);

    const handleInvite = (agentId: string) => {
        mutate(agentId);
        router.refresh();
    };

    useEffect(() => {
        if (result && !result.success) {
            toast.add({
                type: 'error',
                description: result.error.message,
            });
        }
    }, [result]);

    return (
        <div className="w-full flex flex-col">
            <div className="flex flex-col gap-2">
                <Label htmlFor="agent-search-input" className="sr-only">
                    Search
                </Label>

                <Input
                    name="agent-search-input"
                    id="agent-search-input"
                    placeholder="Search agents by name or agency"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />

                <div className="flex flex-col gap-3 mt-1 max-h-82 min-h-82">
                    {isPending &&
                        Array.from({ length: 5 }).map((_, idx) => (
                            <AgentSearchItemSkeleton key={idx} />
                        ))}
                    {result?.success && result.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center gap-1 py-10 text-center">
                            <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted">
                                <UserSearch className="size-5 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">
                                {searchValue
                                    ? 'No agents found'
                                    : 'No agents available'}
                            </p>
                            <p className="max-w-xs text-xs text-muted-foreground">
                                {searchValue
                                    ? `We couldn't find anyone matching "${searchValue}". Try a different name or agency.`
                                    : 'Everyone is already invited or assigned to this property.'}
                            </p>
                        </div>
                    )}
                    {result?.success &&
                        result.data.map((item) => (
                            <AgentSearchItem
                                agentId={item.userId}
                                email={item.email ?? ''}
                                key={item.id}
                                name={item.name ?? ''}
                                avatar={item.avatar ?? ''}
                                onInvite={handleInvite}
                                isPushing={
                                    isPushing && invitingAgentId === item.userId
                                }
                                disabled={
                                    isPushing && invitingAgentId !== item.userId
                                }
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default AgentSearchList;
