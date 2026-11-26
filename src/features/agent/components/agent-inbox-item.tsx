import { differenceInCalendarDays, formatDistanceToNow } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/get-initials';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';
import { Check, Loader, X } from 'lucide-react';
import {
    useAcceptRequest,
    useDeclineRequest,
} from '@/features/invities/queries/use-invite';
import { useRouter } from 'next/navigation';

interface AgentInboxItemProps {
    id: string;
    name: string;
    avatar: string | null;
    propertyType: string | undefined;
    city: string | undefined;
    bedrooms: number | null;
    area: string | null;
    yearBuilt: number | null;
    bathrooms: string | null;
    fullAddress: string;
    message: string | null;
    expireDate: Date;
    createdAt: Date;
    propertyId: string;
}

const AgentInboxItem = ({
    name,
    avatar,
    createdAt,
    bedrooms,
    city,
    propertyType,
    area,
    bathrooms,
    yearBuilt,
    fullAddress,
    message,
    expireDate,
    propertyId,
}: AgentInboxItemProps) => {
    const router = useRouter();

    const { mutate: declineRequest, isPending: isDeclining } =
        useDeclineRequest(propertyId);
    const { mutate: acceptRequest, isPending: isAccepting } =
        useAcceptRequest(propertyId);

    const targetDate = new Date(expireDate);
    const today = new Date();

    const daysLeft = differenceInCalendarDays(targetDate, today);

    const handleAcceptRequest = () => {
        acceptRequest();
        router.refresh();
    };

    return (
        <div className="rounded-lg border p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <Avatar className="size-9">
                    <AvatarImage src={avatar ?? undefined} />
                    <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                        {name} invited you
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(createdAt), {
                            addSuffix: true,
                        })}
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className="border-amber-500 text-amber-700"
                >
                    Pending
                </Badge>
            </div>

            <div className="rounded-md bg-muted p-3 text-sm flex flex-col gap-1">
                <p className="font-medium">
                    {propertyType && propertyType} in {city && city}
                </p>
                <p className="text-xs text-muted-foreground">{fullAddress}</p>
                <p className="text-xs text-muted-foreground">
                    {bedrooms && `${bedrooms} bed ·`}
                    {bathrooms && `${bathrooms} bath ·`}
                    {area && `${area} sqft ·`}{' '}
                    {yearBuilt &&
                        `Built
                    ${yearBuilt}`}
                </p>
            </div>

            {message && (
                <blockquote className="border-l-2 pl-3 text-sm italic text-muted-foreground">
                    &quot;{message}&quot;
                </blockquote>
            )}
            <div className="inline-flex justify-between items-center">
                <p
                    className={cn(
                        'text-xs',
                        daysLeft <= 3
                            ? 'text-destructive'
                            : 'text-muted-foreground',
                    )}
                >
                    Expires in {daysLeft} days
                </p>

                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => declineRequest()}
                        disabled={isDeclining || isAccepting}
                    >
                        {isDeclining ? (
                            <Loader className="animate-spin" />
                        ) : (
                            <X />
                        )}{' '}
                        Decline
                    </Button>
                    <Button
                        size="sm"
                        disabled={isDeclining || isAccepting}
                        onClick={handleAcceptRequest}
                    >
                        {isAccepting ? (
                            <Loader className="animate-spin" />
                        ) : (
                            <Check />
                        )}{' '}
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AgentInboxItem;
