'use client';

import { useState } from 'react';
import { ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { cn } from 'cn';

import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '../constants/nav-links';
import MobileUserMenu from './mobile-user-menu';

const MENU_ID = 'mobile-menu';

const MobileMenu = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Button
                className="md:hidden"
                aria-label={'Open menu'}
                aria-expanded={open}
                aria-controls={MENU_ID}
                onClick={() => setOpen((prev) => !prev)}
            >
                <Menu />
            </Button>

            <div
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className={cn(
                    'absolute left-0 top-0 z-50 h-dvh w-full overflow-y-auto bg-white px-2 pb-6 pt-2 md:hidden',
                    'transition-[translate,visibility] duration-300 ease-in-out',
                    open
                        ? 'visible translate-x-0'
                        : 'invisible -translate-x-full',
                )}
                id={MENU_ID}
            >
                <MobileUserMenu setOpen={setOpen} />
                <hr className="border-neutral-200" />

                <ul className="flex flex-col mt-4">
                    {NAV_LINKS.map(({ label, href }) => (
                        <li
                            key={href}
                            className="flex justify-between px-3 py-3.5"
                        >
                            <Link
                                href={href}
                                className="text-lg font-semibold text-neutral-950"
                            >
                                {label}
                            </Link>
                            <ChevronRight />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default MobileMenu;
