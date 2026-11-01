import Link from 'next/link';
import { LogOut, X } from 'lucide-react';

import Logo from '@/components/svg/brand/Logo';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import AuthModal from '../../../../features/auth/components/AuthModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/getInitials';
import { AUTH_VISIBLE_LINKS } from '@/constants/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import MobileUserHeader from './MobileUserHeader';
import MobileMenuLinks from './MobileMenuLinks';

interface MobileUserMenuProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileUserMenu: React.FC<MobileUserMenuProps> = ({ setOpen }) => {
    const { data: session, isPending } = authClient.useSession();

    return (
        <>
            <MobileUserHeader
                isPending={isPending}
                session={session}
                onClose={() => setOpen(false)}
            />

            <MobileMenuLinks
                isPending={isPending}
                session={session}
                onClose={() => setOpen(false)}
            />
        </>
    );
};

export default MobileUserMenu;
