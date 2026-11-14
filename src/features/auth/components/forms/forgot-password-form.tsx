import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { toast } from '@/components/ui/toast';
import { authClient } from '@/lib/auth/auth-client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    forgotPasswordInput,
    forgotPasswordSchema,
} from '../../schemas/auth-zod-schemas';
import { AuthView } from '../../types';

interface ForgotPasswordFormProps {
    onClose?: () => void;
    setView: (view: AuthView) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    onClose,
    setView,
}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: forgotPasswordInput) => {
        const { error } = await authClient.requestPasswordReset({
            email: data.email,
            redirectTo: `/reset-password?email=${encodeURIComponent(data.email)}`,
        });

        if (error) {
            toast.add({
                type: 'error',
                description: error.message ?? 'Could not send reset email',
            });
            return;
        }

        toast.add({
            type: 'success',
            description: `If an account exists for ${data.email}, you will receive a reset link.`,
        });

        reset();
        onClose?.();
    };

    return (
        <form
            className="mt-2 flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="sr-only">
                    Email
                </Label>
                <Input
                    id="email"
                    placeholder="Email address"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    {...register('email')}
                />
            </div>

            <Button
                type="submit"
                className="w-full h-11"
                disabled={isSubmitting}
            >
                Send a password reset email
            </Button>
            <Button
                type="button"
                variant="outline"
                className="w-full h-11"
                onClick={() => setView('sign-in')}
            >
                Back
            </Button>
        </form>
    );
};

export default ForgotPasswordForm;
