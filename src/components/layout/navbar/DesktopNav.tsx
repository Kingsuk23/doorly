import Link from 'next/link';
import { navLinks } from './nav-links';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { useGetAgent } from '@/features/agent/queries/agentQueries';
import { Skeleton } from '@/components/ui/skeleton';

const DesktopNav = () => {
    const { data: agent, isLoading } = useGetAgent();

    return (
        <div className="hidden md:flex items-center gap-8 justify-between">
            <ul className="flex items-center gap-6">
                {navLinks.map(({ label, href }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className="text-base text-neutral-700 transition-colors hover:text-neutral-950"
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex items-center gap-4">
                {isLoading ? (
                    <Skeleton className="h-9 w-30" />
                ) : (
                    !agent && (
                        <Button variant="outline" asChild>
                            <Link href="/join-agent">Join as agent</Link>
                        </Button>
                    )
                )}
                <UserMenu />
            </div>
        </div>
    );
};

export default DesktopNav;
