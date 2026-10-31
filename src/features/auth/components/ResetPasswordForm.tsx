'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeClosed, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import {
    resetPassword,
    resetPasswordSchema,
} from '../schemas/resetPasswordSchema';
import { authClient } from '@/lib/auth-client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthModal } from '../store/authModal';

interface ResetPasswordProps {
    token: string;
    email?: string;
}

const ResetPasswordForm: React.FC<ResetPasswordProps> = ({ token, email }) => {
    const [show, setShow] = useState<boolean>(false);

    const open = useAuthModal((state) => state.open);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(resetPasswordSchema) });

    const onSubmit = async (data: resetPassword) => {
        if (!token) {
            toast.error('Invalid or expired reset link');
            return;
        }

        const { error } = await authClient.resetPassword({
            newPassword: data.password,
            token,
        });

        if (error) {
            toast.error(error.message ?? 'Could not reset password');
            return;
        }

        toast.success('Password reset successfully');

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

        toast.message('Please sign in with your new password.');
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

                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                type="button"
                                onClick={() => setShow((prev) => !prev)}
                            >
                                {show ? (
                                    <EyeClosed size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
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
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <LoaderCircle size={20} className="animate-spin" />
                        )}
                        Reset Password
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ResetPasswordForm;
