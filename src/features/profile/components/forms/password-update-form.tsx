import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeClosed } from 'lucide-react';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from '@/components/ui/toast';
import {
    updatePasswordInput,
    updatePasswordSchema,
} from '../../schema/profile-zod-schemas';

const PasswordUpdateForm = ({ onClose }: { onClose: () => void }) => {
    const [show, setShow] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(updatePasswordSchema),
        mode: 'onChange',
    });

    const onSubmit = async ({
        currentPassword,
        newPassword,
    }: updatePasswordInput) => {
        const { error } = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
        });

        if (error) {
            setError('root', {
                message: error.message ?? 'Invalid credentials',
            });
            return;
        }

        toast.add({
            type: 'success',
            description: 'Password update successfully',
        });
        reset();
        onClose();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-2"
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="old_password" className="sr-only">
                    Old password
                </Label>
                <div className="relative w-full">
                    <Input
                        id="old_password"
                        type={show ? 'text' : 'password'}
                        placeholder="Old password"
                        aria-invalid={errors.currentPassword ? 'true' : 'false'}
                        {...register('currentPassword')}
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

            <div className="flex flex-col gap-2">
                <Label htmlFor="new_password" className="sr-only">
                    New password
                </Label>
                <div className="relative w-full">
                    <Input
                        id="new_password"
                        type={show ? 'text' : 'password'}
                        placeholder="New password"
                        aria-invalid={errors.newPassword ? 'true' : 'false'}
                        {...register('newPassword')}
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

                {errors.newPassword && (
                    <p className="text-destructive text-sm">
                        {errors.newPassword.message}
                    </p>
                )}
            </div>
            {errors.root && (
                <div className="bg-destructive/10 rounded-md h-8 flex items-center text-destructive px-2">
                    {errors.root.message}
                </div>
            )}
            <Button
                type="submit"
                className="w-full h-11"
                size="lg"
                disabled={isSubmitting}
            >
                Update password
            </Button>
        </form>
    );
};

export default PasswordUpdateForm;
