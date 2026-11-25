import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/get-initials';

type CurrentAgentItemProps = {
    memberId: string;
    name: string;
    email: string;
    image?: string | null;
    status: 'pending' | 'approved' | 'revoked';
    isRemoving: boolean;
    onRemove: (memberId: string, agentUserId: string) => void;
    agentUserId: string;
};

const CurrentAgentItem = ({
    memberId,
    name,
    email,
    image,
    status,
    isRemoving,
    onRemove,
    agentUserId,
}: CurrentAgentItemProps) => {
    return (
        <div className="flex items-center gap-3 min-h-95 max-h-95 overflow-y-auto ">
            <Avatar className="size-8">
                <AvatarImage src={image ?? undefined} alt={name} />
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex gap-1 items-center">
                    <p className="text-sm truncate">{name}</p>
                    <Badge
                        variant={status === 'pending' ? 'outline' : 'secondary'}
                    >
                        {status === 'pending' ? 'Pending' : 'Approved'}
                    </Badge>
                </div>

                <p className="text-xs text-muted-foreground truncate">
                    {email}
                </p>
            </div>

            <Button
                size="sm"
                variant="ghost"
                className="text-destructive"
                disabled={isRemoving}
                onClick={() => onRemove(memberId, agentUserId)}
            >
                {status === 'pending' ? 'Cancel invite' : 'Remove'}
            </Button>
        </div>
    );
};

export default CurrentAgentItem;
