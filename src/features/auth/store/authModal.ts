import { create } from 'zustand';

export type AuthView = 'sign-in' | 'sign-up' | 'forgot';

interface AuthModalProps {
    view: AuthView;
    isOpen: boolean;
    setView: (view: AuthView) => void;
    open: (view?: AuthView) => void;
    close: () => void;
    url: string;
    setRedirectUrl: (url?: string) => void;
}

export const useAuthModal = create<AuthModalProps>((set) => ({
    view: 'sign-in',
    isOpen: false,
    url: '/',

    setView: (view) => set({ view }),

    open: (view = 'sign-in') =>
        set({
            isOpen: true,
            view,
        }),

    close: () =>
        set({
            isOpen: false,
            view: 'sign-in',
        }),
    setRedirectUrl: (url = '/') => set({ url }),
}));
