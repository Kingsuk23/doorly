import Link from 'next/link';

import Logo from '../../brand/Logo';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';

const Navbar = () => {
    return (
        <header className="sticky top-0 z-40 shadow-sm bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/75">
            <nav
                aria-label="Main"
                className="max-w-7xl mx-auto py-2 flex justify-between items-center md:px-4 px-2"
            >
                <Link href="/" aria-label="Home" className="shrink-0">
                    <Logo height={42} />
                </Link>

                <DesktopNav />
                <MobileMenu />
            </nav>
        </header>
    );
};

export default Navbar;
