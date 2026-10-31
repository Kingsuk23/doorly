import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import {
    forgotPassword,
    forgotPasswordSchema,
} from '../schemas/forgotPasswordSchema';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

interface ForgotPasswordFormProps {
    onClose?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onClose }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

    const onSubmit = async (data: forgotPassword) => {
        const { error } = await authClient.requestPasswordReset({
            email: data.email,
            redirectTo: `/reset-password?email=${encodeURIComponent(data.email)}`,
        });

        if (error) {
            toast.error(error.message ?? 'Could not send reset email');
            return;
        }

        toast.success('Password reset email sent', {
            description: `If an account exists for ${data.email}, you will receive a reset link.`,
        });

        reset();
        onClose?.();
    };

    return (
        <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="sr-only">
                            Email
                        </Label>
                        <Input
                            placeholder="Email address"
                            aria-invalid={errors.email ? 'true' : 'false'}
                            {...register('email')}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <LoaderCircle size={20} className="animate-spin" />
                        )}
                        Send a password reset email
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ForgotPasswordForm;
