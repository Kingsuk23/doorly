import { authClient } from '@/lib/auth/auth-client';
import MobileMenuHeader from './mobile-menu-header';
import MobileMenuLinks from './mobile-menu-links';

interface MobileUserMenuProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileUserMenu = ({ setOpen }: MobileUserMenuProps) => {
    const { data: session, isPending } = authClient.useSession();

    return (
        <>
            <MobileMenuHeader
                isPending={isPending}
                session={session}
                onClose={() => setOpen(false)}
            />

            <div className="flex flex-col gap-4 my-6">
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
