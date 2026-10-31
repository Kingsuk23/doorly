import { Eye, EyeClosed, LoaderCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import OrDivider from '@/components/ui/OrDivider';
import SocialButtons from './SocialButtons';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { type signup, signupSchema } from '../schemas/signupSchema';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

interface SignUpFormProps {
    onSwitchToSignin: () => void;
    onClose: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
    onSwitchToSignin,
    onClose,
}) => {
    const [show, setShow] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(signupSchema) });

    const onSubmit = async (data: signup) => {
        const { error } = await authClient.signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
            callbackURL: '/',
        });

        if (error) {
            toast.error(error.message ?? 'Could not create account');
            return;
        }

        toast.success('Verification email sent', {
            description: `Check ${data.email} to verify your account.`,
        });

        reset();
        onClose();
    };
    return (
        <form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="sr-only">
                            Name
                        </Label>
                        <Input
                            placeholder="Name"
                            aria-invalid={errors.name ? 'true' : 'false'}
                            {...register('name')}
                        />
                    </div>
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
                        Sign up
                    </Button>
                </div>
                <OrDivider label="or" />
                <SocialButtons />
                <div className="flex items-center gap-0.5">
                    <p className="text-sm">Already have an account?</p>
                    <button
                        type="button"
                        className="underline text-sm cursor-pointer"
                        onClick={() => onSwitchToSignin()}
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SignUpForm;
