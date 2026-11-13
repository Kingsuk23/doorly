import Link from 'next/link';
import { X } from 'lucide-react';

import Logo from '@/components/icons/brand/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/get-initials';
import { useState } from 'react';
import { Session } from '@/features/auth/types';

interface MobileMenuHeaderProps {
    isPending: boolean;
    onClose: () => void;
    session: Session | null;
}

const MobileMenuHeader = ({
    isPending,
    onClose,
    session,
}: MobileMenuHeaderProps) => {
    const [] = useState(false);

    return (
        <div className="flex justify-between items-center px-3">
            {isPending ? (
                <div className="flex items-center outline-none gap-3">
                    <Skeleton className="size-8 rounded-full" />
                    <Skeleton className="h-6 w-20" />
                </div>
            ) : session ? (
                <Link
                    href="/profile"
                    className="flex items-center outline-none gap-3"
                >
                    <Avatar>
                        <AvatarImage
                            src={session.user.image ?? undefined}
                            alt={session.user.name}
                        />
                        <AvatarFallback>
                            {getInitials(session.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <p className="text-xl font-semibold">{session.user.name}</p>
                </Link>
            ) : (
                <Link href="/" aria-label="Home" className="shrink-0">
                    <Logo height={42} />
                </Link>
            )}

            <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Close menu"
                onClick={onClose}
            >
                <X className="text-neutral-950" size={24} />
            </Button>
        </div>
    );
};

export default MobileMenuHeader;
