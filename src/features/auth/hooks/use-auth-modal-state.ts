import { useAuthModal } from '../stores/auth-modal-states';

export const useAuthModalState = () => {
    const isOpen = useAuthModal((state) => state.isOpen);
    const view = useAuthModal((state) => state.view);
    const email = useAuthModal((state) => state.email);
    const setView = useAuthModal((state) => state.setView);
    const setEmail = useAuthModal((state) => state.setEmail);
    const open = useAuthModal((state) => state.open);
    const close = useAuthModal((state) => state.close);
    const url = useAuthModal((state) => state.url);

    return {
        isOpen,
        view,
        setView,
        open,
        close,
        url,
        email,
        setEmail,
    };
};
