import MobileMenuLinksSkeleton from '../skeleton/MobileMenuLinksSkeleton';
import AuthModal from '@/features/auth/components/AuthModal';
import { AUTH_VISIBLE_LINKS } from '@/constants/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { LogOut, User } from 'lucide-react';
import { Session } from '@/features/auth/types';
import { useGetAgent } from '@/features/agent/queries/agentQueries';
import { cn } from 'cn';
import { Skeleton } from '@/components/ui/skeleton';

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
    const { data: agent, isLoading } = useGetAgent();

    if (isPending) {
        return <MobileMenuLinksSkeleton />;
    }

    if (!session) {
        return <AuthModal onAbort={onClose} className="w-full" size="lg" />;
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
            {isLoading ? (
                <div className="w-full bg-muted-foreground/10 rounded-md p-4 flex flex-col gap-2">
                    <Skeleton className="size-6 w-full" />
                    <Skeleton className="w-20 h-4" />
                </div>
            ) : (
                <Link
                    href="/agent-profile"
                    className={cn(
                        'w-full bg-muted-foreground/10 rounded-md p-4 flex-col items-start gap-2',
                        agent ? 'flex' : 'hidden',
                    )}
                >
                    <User />
                    Agent profile
                </Link>
            )}

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
