import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Skeleton } from '@/components/ui/skeleton';
import MobileUserHeader from './MobileUserHeader';
import MobileMenuLinks from './MobileMenuLinks';
import { useGetAgent } from '@/features/agent/queries/agentQueries';

interface MobileUserMenuProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileUserMenu: React.FC<MobileUserMenuProps> = ({ setOpen }) => {
    const { data: session, isPending } = authClient.useSession();
    const { data: agent, isLoading } = useGetAgent();

    const renderButton = () => {
        if (isLoading) return <Skeleton className="h-9 w-full" />;
        if (agent) return;

        return (
            <Button variant="outline" asChild className="w-full">
                <Link href="/join-agent">Join as agent</Link>
            </Button>
        );
    };
    return (
        <>
            <MobileUserHeader
                isPending={isPending}
                session={session}
                onClose={() => setOpen(false)}
            />

            <div className="flex flex-col gap-4 my-6">
                {renderButton()}
                <MobileMenuLinks
                    isPending={isPending}
                    session={session}
                    onClose={() => setOpen(false)}
                />
            </div>
        </>
    );
};

export default MobileUserMenu;
