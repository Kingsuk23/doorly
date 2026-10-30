'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from 'cn';

import { navLinks } from './nav-links';
import Logo from '@/components/brand/Logo';

const MENU_ID = 'mobile-menu';

const MobileMenu = () => {
    const [open, setOpen] = useState<boolean>(false);

    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };

        const media = window.matchMedia('(min-width:768px)');
        const onChange = (e: MediaQueryListEvent) =>
            e.matches && setOpen(false);

        document.addEventListener('keydown', onKeyDown);
        media.addEventListener('change', onChange);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            media.removeEventListener('change', onChange);
        };
    }, [open]);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

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
                <div className="flex justify-between items-center">
                    <Link href="/" aria-label="Home" className="shrink-0">
                        <Logo height={42} />
                    </Link>

                    <Button
                        variant="ghost"
                        size="icon-lg"
                        aria-label="Close menu"
                        onClick={() => setOpen(false)}
                    >
                        <X className="text-neutral-950" size={24} />
                    </Button>
                </div>

                <Button className="my-6 w-full" size="lg">
                    Join/Sign in
                </Button>

                <hr className="border-neutral-200" />

                <ul className="flex flex-col mt-5">
                    {navLinks.map(({ label, href }) => (
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
