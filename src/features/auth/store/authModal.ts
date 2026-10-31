import { create } from 'zustand';

export type AuthView = 'sign-in' | 'sign-up' | 'forgot';

interface AuthModalProps {
    view: AuthView;
    isOpen: boolean;
    setView: (view: AuthView) => void;
    open: (view?: AuthView) => void;
    close: () => void;
}

export const useAuthModal = create<AuthModalProps>((set) => ({
    view: 'sign-in',
    isOpen: false,

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
}));
