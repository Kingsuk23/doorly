import Link from 'next/link';
import { navLinks } from './nav-links';
import { Button } from '@/components/ui/button';

const DesktopNav = () => {
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

            <Button>Join/Sign in</Button>
        </div>
    );
};

export default DesktopNav;
