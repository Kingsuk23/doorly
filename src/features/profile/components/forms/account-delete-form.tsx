import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';

import { authClient } from '@/lib/auth/auth-client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
    passwordVerificationInput,
    passwordVerificationSchema,
} from '../../schema/profile-zod-schemas';

const AccountDeleteForm = ({ onClose }: { onClose: () => void }) => {
    const router = useRouter();

    const [show, setShow] = useState(false);
    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(passwordVerificationSchema),
    });

    const onSubmit = async (data: passwordVerificationInput) => {
        const { error } = await authClient.deleteUser({
            password: data.password,
        });

        if (error) {
            setError('root', {
                message: error.message ?? 'Something went wrong',
            });

            return;
        }

        onClose();

        router.push('/');
        router.refresh();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-2"
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="sr-only">
                    Password
                </Label>
                <div className="relative w-full">
                    <Input
                        id="password"
                        type={show ? 'text' : 'password'}
                        placeholder="Password"
                        aria-invalid={errors.password ? 'true' : 'false'}
                        {...register('password')}
                    />

                    <Button
                        variant="ghost"
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0"
                        onClick={() => setShow((prev) => !prev)}
                    >
                        {show ? <EyeClosed size={20} /> : <Eye size={20} />}
                    </Button>
                </div>
            </div>
            {errors.root && (
                <div className="bg-destructive/10 rounded-md h-8 flex items-center text-destructive px-2">
                    {errors.root.message}
                </div>
            )}
            <Button
                type="submit"
                className="w-full h-11"
                variant="destructive"
                disabled={isSubmitting}
            >
                Delete account
            </Button>
        </form>
    );
};

export default AccountDeleteForm;
