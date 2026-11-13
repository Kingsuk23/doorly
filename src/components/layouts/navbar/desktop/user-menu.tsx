'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthModal from '@/features/auth/components/auth-modal';
import { authClient } from '@/lib/auth/auth-client';
import { getInitials } from '@/lib/get-initials';
import { AUTH_VISIBLE_LINKS } from '../constants/nav-links';
import UserMenuSkeleton from '../skeletons/user-menu-skeleton';

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
            <DropdownMenuTrigger render={<Button variant="ghost" />}>
                <span className="text-base">{name}</span>
                <Avatar>
                    <AvatarImage src={image ?? undefined} alt={name} />
                    <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        <span className="block text-sm font-medium">
                            {name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                            {email}
                        </span>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {AUTH_VISIBLE_LINKS.map(({ label, href }) => (
                    <DropdownMenuItem
                        key={label}
                        render={<Link href={href} />}
                        className="cursor-pointer"
                        onClick={() => setOpen(false)}
                    >
                        {label}
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => authClient.signOut()}
                >
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;
