'use client';

import LogoType from '@/components/svg/brand/LogoType';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import LoginForm from './LoginForm';
import AuthLegalLinks from './AuthLegalLinks';
import SignUpForm from './SignUpForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { AuthView, useAuthModal } from '../store/authModal';

const VIEW_TEXT: Record<AuthView, { title: string; description: string }> = {
    'sign-in': {
        title: 'Welcome to Doorly',
        description: 'Join Doorly for free to discover more properties',
    },
    'sign-up': {
        title: 'Create your account',
        description: 'It only takes a minute to get started',
    },
    forgot: {
        title: 'Reset your password',
        description: "Enter your email and we'll send you a reset link",
    },
};

interface AuthModalProps {
    onAbort?: () => void;
    className?: string;
    size?: 'default' | 'xs' | 'sm' | 'lg';
}

const AuthModal: React.FC<AuthModalProps> = ({ onAbort, className, size }) => {
    const isOpen = useAuthModal((state) => state.isOpen);
    const view = useAuthModal((state) => state.view);
    const setView = useAuthModal((state) => state.setView);
    const open = useAuthModal((state) => state.open);
    const close = useAuthModal((state) => state.close);

    const { title, description } = VIEW_TEXT[view];

    return (
        <>
            <Button
                onClick={() => {
                    open();
                    onAbort?.();
                }}
                className={className}
                size={size}
            >
                Join/Sign in
            </Button>
            <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
                <DialogContent>
                    <DialogHeader>
                        <div className="rounded-lg bg-muted size-14 flex justify-center items-center">
                            <LogoType width={32} height={32} />
                        </div>
                        <DialogTitle className="mt-2 text-2xl font-bold">
                            {title}
                        </DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>

                    {view === 'sign-in' && (
                        <LoginForm
                            onForgotPassword={() => setView('forgot')}
                            onSwitchToSignup={() => setView('sign-up')}
                        />
                    )}

                    {view === 'sign-up' && (
                        <SignUpForm
                            onSwitchToSignin={() => setView('sign-in')}
                            onClose={close}
                        />
                    )}

                    {view === 'forgot' && (
                        <ForgotPasswordForm onClose={close} />
                    )}
                    <AuthLegalLinks />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AuthModal;
