import { BookMarked, CircleUserRound, HeartIcon } from 'lucide-react';

export const NAV_LINKS = [
    { label: 'Buy', href: '/buy' },
    { label: 'Sell', href: '/sell' },
    { label: 'Rent', href: '/rent' },
    { label: 'Mortgage', href: '/mortgage' },
    { label: 'Real Estate Agents', href: '/real-estate-agents' },
    { label: 'Feed', href: '/feed' },
];

export const AUTH_VISIBLE_LINKS = [
    { label: 'Profile', href: '/profile', icon: CircleUserRound },
    { label: 'Favorites', href: '/favorites', icon: HeartIcon },
    { label: 'Save Search', href: '/save-search', icon: BookMarked },
];
