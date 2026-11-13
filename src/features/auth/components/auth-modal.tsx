import LogoIcon from '@/components/icons/brand/logo-icon';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AuthLegalLinks from './auth-legal-links';
import { AUTH_VIEW_TEXT } from '../constants/auth';
import { useAuthModalState } from '../hooks/use-auth-modal-state';

interface AuthModalProps {
    size?:
        | 'default'
        | 'xs'
        | 'sm'
        | 'lg'
        | 'icon'
        | 'icon-xs'
        | 'icon-sm'
        | 'icon-lg';
    className?: string;
}

const AuthModal = ({ className, size }: AuthModalProps) => {
    const { close, isOpen, open, view } = useAuthModalState();

    const { title, description } = AUTH_VIEW_TEXT[view];

    return (
        <>
            <Button
                onClick={() => {
                    open();
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
                            <LogoIcon width={32} height={32} />
                        </div>
                        <DialogTitle className="mt-2 text-2xl font-bold">
                            {title}
                        </DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>

                    <AuthLegalLinks />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AuthModal;
