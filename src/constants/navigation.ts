import { BookMarked, CircleUserRound, HeartIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavLink {
    label: string;
    href: string;
    icon: LucideIcon;
}

export const AUTH_VISIBLE_LINKS: NavLink[] = [
    { label: 'Profile', href: '/profile', icon: CircleUserRound },
    { label: 'Favorites', href: '/favorites', icon: HeartIcon },
    { label: 'Save Search', href: '/save-search', icon: BookMarked },
];
