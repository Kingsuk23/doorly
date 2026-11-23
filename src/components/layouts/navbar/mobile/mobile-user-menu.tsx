import { authClient } from '@/lib/auth/auth-client';
import MobileMenuHeader from './mobile-menu-header';
import MobileMenuLinks from './mobile-menu-links';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MobileUserMenuProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    agentId: string | null;
}

const MobileUserMenu = ({ setOpen, agentId }: MobileUserMenuProps) => {
    const { data: session, isPending } = authClient.useSession();

    return (
        <>
            <MobileMenuHeader
                isPending={isPending}
                session={session}
                onClose={() => setOpen(false)}
            />

            <div className="flex flex-col gap-4 my-6">
                {!agentId && (
                    <Button
                        render={<Link href="/join-as-agent" />}
                        className="w-full"
                        variant="outline"
                        nativeButton={false}
                    >
                        Join as agent
                    </Button>
                )}
                <MobileMenuLinks
                    agentId={agentId}
                    isPending={isPending}
                    session={session}
                    onClose={() => setOpen(false)}
                />
            </div>
        </>
    );
};

export default MobileUserMenu;
