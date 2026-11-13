import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { COOLDOWN_SECONDS } from '../constants/auth';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from '@/components/ui/toast';

interface EmailSendMessageProps {
    onClose: () => void;
    email?: string;
}

const EmailSendMessage = ({ onClose, email }: EmailSendMessageProps) => {
    const [secondsLeft, setSecondsLeft] = useState(COOLDOWN_SECONDS);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [secondsLeft]);

    const handleResend = async () => {
        if (!email || isSending || secondsLeft > 0) return;

        setIsSending(true);
        const { error } = await authClient.sendVerificationEmail({
            email,
            callbackURL: '/',
        });
        setIsSending(false);

        if (error) {
            toast.add({
                type: 'error',
                description: error.message ?? 'Could not resend the email',
            });
            return;
        }

        setSecondsLeft(COOLDOWN_SECONDS);
    };

    return (
        <div className=" flex flex-col gap-4">
            <Button className="w-full h-11" onClick={onClose}>
                Close
            </Button>
            <div className="flex items-center">
                <span className="text-sm text-foreground">
                    Don&apos;t received an email?
                </span>
                <Button
                    variant="link"
                    className="p-0 font-semibold"
                    onClick={handleResend}
                    disabled={isSending || secondsLeft > 0 || !email}
                >
                    {secondsLeft > 0
                        ? `Resend in ${secondsLeft}s`
                        : 'Resend email'}
                </Button>
            </div>
        </div>
    );
};

export default EmailSendMessage;
