import Link from 'next/link';

import { LogOut } from 'lucide-react';

import { AUTH_VISIBLE_LINKS } from '../constants/nav-links';
import AuthModal from '@/features/auth/components/auth-modal';
import { authClient } from '@/lib/auth/auth-client';
import { Session } from '@/features/auth/types';
import MobileMenuLinksSkeleton from '../skeletons/mobile-menu-link-skeleton';
import { useRouter } from 'next/navigation';
import { useAuthModalState } from '@/features/auth/hooks/use-auth-modal-state';
import { Button } from '@/components/ui/button';

interface MobileMenuLinksProps {
    isPending: boolean;
    onClose: () => void;
    session: Session | null;
}

const MobileMenuLinks = ({
    onClose,
    isPending,
    session,
}: MobileMenuLinksProps) => {
    const router = useRouter();
    const { open: DialogOpen, isOpen: isDialogOPen } = useAuthModalState();

    if (isPending) {
        return <MobileMenuLinksSkeleton />;
    }

    if (!session) {
        return (
            <>
                <Button
                    onClick={() => {
                        DialogOpen();
                    }}
                    className="w-full"
                >
                    Join/Sign in
                </Button>

                {isDialogOPen && <AuthModal />}
            </>
        );
    }
    return (
        <div className="grid grid-cols-2 gap-4 w-full px-3">
            {AUTH_VISIBLE_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                    href={href}
                    key={label}
                    className="w-full bg-muted-foreground/10 rounded-md p-4 flex flex-col gap-2"
                    onClick={onClose}
                >
                    <Icon />
                    {label}
                </Link>
            ))}

            <button
                className="w-full bg-muted-foreground/10 rounded-md p-4 flex flex-col items-start gap-2"
                onClick={() => {
                    authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                onClose();
                                router.replace('/');
                                router.refresh();
                            },
                        },
                    });
                }}
            >
                <LogOut />
                Sign out
            </button>
        </div>
    );
};

export default MobileMenuLinks;
