'use client';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthModal from '@/features/auth/components/AuthModal';
import { authClient } from '@/lib/auth-client';
import UserMenuSkeleton from './skeleton/UserMenuSkeleton';
import { getInitials } from '@/lib/getInitials';
import { AUTH_VISIBLE_LINKS } from '@/constants/navigation';

const UserMenu = () => {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return <UserMenuSkeleton />;
    }

    if (!session) return <AuthModal />;

    const { name, email, image } = session.user;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
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
                    <DropdownMenuItem asChild key={label}>
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
