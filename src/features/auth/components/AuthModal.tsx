'use client';

import LogoType from '@/components/svg/brand/LogoType';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import LoginForm from './LoginForm';
import AuthLegalLinks from './AuthLegalLinks';
import { useState } from 'react';
import SignUpForm from './SignUpForm';

type AuthView = 'sign-in' | 'sign-up' | 'forgot';

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

const AuthModal = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [modalView, setModalView] = useState<AuthView>('sign-in');

    const { title, description } = VIEW_TEXT[modalView];

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) setModalView('sign-in');
    };
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>Join/Sign in</Button>
            </DialogTrigger>
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

                {modalView === 'sign-in' && (
                    <LoginForm
                        onForgotPassword={() => setModalView('forgot')}
                        onSwitchToSignup={() => setModalView('sign-up')}
                    />
                )}

                {modalView === 'sign-up' && (
                    <SignUpForm
                        onSwitchToSignin={() => setModalView('sign-in')}
                        onClose={() => handleOpenChange(false)}
                    />
                )}
                <AuthLegalLinks />
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
