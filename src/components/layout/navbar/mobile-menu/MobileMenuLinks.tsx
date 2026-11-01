import MobileMenuLinksSkeleton from '../skeleton/MobileMenuLinksSkeleton';
import AuthModal from '@/features/auth/components/AuthModal';
import { AUTH_VISIBLE_LINKS } from '@/constants/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { LogOut } from 'lucide-react';
import { Session } from '@/types/auth';

interface MobileMenuLinksProps {
    isPending: boolean;
    session: Session | null;
    onClose: () => void;
}

const MobileMenuLinks: React.FC<MobileMenuLinksProps> = ({
    isPending,
    onClose,
    session,
}) => {
    if (isPending) {
        return <MobileMenuLinksSkeleton />;
    }

    if (!session) {
        return (
            <AuthModal onAbort={onClose} className="w-full my-6" size="lg" />
        );
    }
    return (
        <div className="grid grid-cols-2 gap-4 w-full my-6 px-3">
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
                    authClient.signOut();
                }}
            >
                <LogOut />
                Sign out
            </button>
        </div>
    );
};

export default MobileMenuLinks;
