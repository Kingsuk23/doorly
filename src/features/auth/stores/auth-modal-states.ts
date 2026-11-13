import { create } from 'zustand';

import { AuthView } from '../types';

interface AuthModalProps {
    view: AuthView;
    isOpen: boolean;
    url: string;
    email: string;
    close: () => void;
    open: (view?: AuthView) => void;
    setView: (view: AuthView) => void;
    setEmail: (email: string) => void;
    setRedirectUrl: (url?: string) => void;
}

export const useAuthModal = create<AuthModalProps>((set) => ({
    view: 'sign-in',
    isOpen: false,
    url: '/',
    email: '',
    setView: (view) => set({ view }),

    open: (view = 'sign-in') =>
        set({
            isOpen: true,
            view,
        }),
    setEmail: (email) => set({ email }),
    close: () =>
        set({
            email: '',
            isOpen: false,
            view: 'sign-in',
        }),
    setRedirectUrl: (url = '/') => set({ url }),
}));
