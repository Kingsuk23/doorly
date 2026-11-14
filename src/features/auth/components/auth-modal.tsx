import LogoIcon from '@/components/icons/brand/logo-icon';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AuthLegalLinks from './auth-legal-links';
import { getAuthViewText } from '../constants/auth';
import { useAuthModalState } from '../hooks/use-auth-modal-state';
import SignUpForm from './forms/sign-up-form';
import EmailSendMessage from './email-send-message';
import { authClient } from '@/lib/auth/auth-client';
import SignInForm from './forms/sign-in-form';
import ForgotPasswordForm from './forms/forgot-password-form';

const AuthModal = () => {
    const { close, isOpen, view, setView, email, setEmail } =
        useAuthModalState();
    const { data: session } = authClient.useSession();

    if (session) {
        close();
    }

    const { title, description } = getAuthViewText(view, email);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
            <DialogContent>
                <DialogHeader>
                    <div className="rounded-lg bg-muted size-14 flex justify-center items-center">
                        <LogoIcon width={32} height={32} />
                    </div>
                    <DialogTitle className="mt-2 text-2xl font-bold">
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {view === 'sign-in' && <SignInForm setView={setView} />}
                {view === 'sign-up' && (
                    <SignUpForm
                        redirectUrl="/"
                        setView={setView}
                        onEmailSent={setEmail}
                    />
                )}
                {view === 'forgot' && (
                    <ForgotPasswordForm onClose={close} setView={setView} />
                )}
                {view === 'verify-email' && (
                    <EmailSendMessage onClose={close} email={email} />
                )}

                <AuthLegalLinks />
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
