import Link from 'next/link';

import { NAV_LINKS } from '../constants/nav-links';
import UserMenu from './user-menu';

const DesktopNav = () => {
    return (
        <div className="hidden md:flex items-center gap-8 justify-between">
            <ul className="flex items-center gap-6">
                {NAV_LINKS.map(({ label, href }) => (
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

            <UserMenu />
        </div>
    );
};

export default DesktopNav;
