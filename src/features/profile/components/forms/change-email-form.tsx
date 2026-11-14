import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    changeEmailInput,
    changeEmailSchema,
} from '../../schema/profile-zod-schemas';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from '@/components/ui/toast';

const ChangeEmailForm = ({ onClose }: { onClose: () => void }) => {
    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(changeEmailSchema),
    });

    const onSubmit = async (data: changeEmailInput) => {
        const { error } = await authClient.changeEmail({
            newEmail: data.email,
            callbackURL: '/profile',
        });

        if (error) {
            setError('root', {
                message: error.message ?? 'Failed to change email',
            });

            return;
        }

        toast.add({
            type: 'success',
            description: `We sent a verification link to ${data.email}. Click it to confirm your new email.`,
        });
        onClose();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-2"
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="Email" className="sr-only">
                    Email
                </Label>

                <Input
                    id="email"
                    placeholder="New email"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    {...register('email')}
                />
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
                Change email
            </Button>
        </form>
    );
};

export default ChangeEmailForm;
