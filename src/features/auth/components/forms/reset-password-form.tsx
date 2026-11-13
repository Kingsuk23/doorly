'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthModalState } from '../../hooks/use-auth-modal-state';
import {
    resetPasswordInput,
    resetPasswordSchema,
} from '../../schemas/auth-zod-schemas';
import { toast } from '@/components/ui/toast';
import { authClient } from '@/lib/auth/auth-client';

interface ResetPasswordProps {
    token: string;
    email?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordProps> = ({ token, email }) => {
    const [show, setShow] = useState(false);

    const { open } = useAuthModalState();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(resetPasswordSchema) });

    const onSubmit = async (data: resetPasswordInput) => {
        if (!token) {
            toast.add({
                type: 'error',
                description: 'Invalid or expired reset link',
            });
            return;
        }

        const { error } = await authClient.resetPassword({
            newPassword: data.password,
            token,
        });

        if (error) {
            toast.add({
                type: 'error',
                description: error.message ?? 'Could not reset password',
            });

            return;
        }

        toast.add({ description: 'Password reset successfully' });

        if (email) {
            const { error: signInError } = await authClient.signIn.email({
                email,
                password: data.password,
                callbackURL: '/',
            });

            if (!signInError) {
                reset();
                return;
            }
        }

        toast.add({ description: 'Please sign in with your new password.' });
        reset();
        open();
    };

    return (
        <form className="mt-2 max-w-md" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password" className="sr-only">
                            Password
                        </Label>
                        <div className="relative w-full">
                            <Input
                                type={show ? 'text' : 'password'}
                                placeholder="Password"
                                aria-invalid={
                                    errors.password ? 'true' : 'false'
                                }
                                {...register('password')}
                            />
                            <Button
                                variant="ghost"
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0"
                                onClick={() => setShow((prev) => !prev)}
                            >
                                {show ? (
                                    <EyeClosed size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </Button>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Use 8 or more letters, numbers and symbols
                        </p>
                        {errors.password && (
                            <p className="text-destructive text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11"
                        disabled={isSubmitting}
                    >
                        Reset Password
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ResetPasswordForm;
