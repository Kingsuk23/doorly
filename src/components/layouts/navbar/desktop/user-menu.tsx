'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth/auth-client';
import { getInitials } from '@/lib/get-initials';
import { AUTH_VISIBLE_LINKS } from '../constants/nav-links';
import UserMenuSkeleton from '../skeletons/user-menu-skeleton';
import AuthModal from '@/features/auth/components/auth-modal';

const UserMenu = () => {
    const [open, setOpen] = useState(false);

    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <UserMenuSkeleton />;
    }

    if (!session) return <AuthModal />;

    const { name, email, image } = session.user;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger>
                <button className="flex items-center gap-2 outline-none cursor-pointer">
                    <p className="text-base">{name}</p>
                    <Avatar>
                        <AvatarImage src={image ?? undefined} alt={name} />
                        <AvatarFallback>{getInitials(name)}</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuLabel>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {AUTH_VISIBLE_LINKS.map(({ label, href }) => (
                    <DropdownMenuItem
                        key={label}
                        onClick={() => setOpen(false)}
                    >
                        <Link href={href} className="cursor-pointer">
                            {label}
                        </Link>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => authClient.signOut()}>
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;
