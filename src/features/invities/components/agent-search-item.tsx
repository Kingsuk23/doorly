import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/get-initials';
import { Loader } from 'lucide-react';

interface AgentSearchItemProps {
    agentId: string;
    avatar?: string;
    name: string;
    email: string;
    onInvite: (agentId: string) => void;
    isPushing: boolean;
    disabled: boolean;
}

const AgentSearchItem = ({
    email,
    name,
    avatar,
    onInvite,
    agentId,
    isPushing,
    disabled,
}: AgentSearchItemProps) => {
    return (
        <div className="w-full flex justify-between items-center p-2 rounded-md hover:bg-muted">
            <div className="flex items-center gap-2">
                <Avatar size="lg">
                    <AvatarImage src={avatar ?? undefined} alt={name} />
                    <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-start">
                    <p className="text-base">{name}</p>
                    <span className="text-xs text-muted-foreground">
                        {email}
                    </span>
                </div>
            </div>

            <Button
                disabled={isPushing || disabled}
                onClick={() => onInvite(agentId)}
            >
                {isPushing ? <Loader className="animate-spin" /> : 'Invite'}
            </Button>
        </div>
    );
};

export default AgentSearchItem;
