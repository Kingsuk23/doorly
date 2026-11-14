import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeClosed } from 'lucide-react';
import { cn } from 'cn';

import { signupInput, signupSchema } from '../../schemas/auth-zod-schemas';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from '@/components/ui/toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthView } from '../../types';

interface SignUpFormProps {
    setView: (view: AuthView) => void;
    onEmailSent?: (email: string) => void;
    redirectUrl: string;
    className?: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
    setView,
    redirectUrl,
    className,
    onEmailSent,
}) => {
    const [show, setShow] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(signupSchema), mode: 'onChange' });

    const onSubmit = async (data: signupInput) => {
        const { error } = await authClient.signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
            callbackURL: redirectUrl,
        });

        if (error) {
            toast.add({
                type: 'error',
                description: error.message ?? 'Could not create account',
            });
            return;
        }

        onEmailSent?.(data.email);
        reset();
        setView('verify-email');
    };

    return (
        <form
            className={cn('mt-2 flex flex-col gap-4', className)}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="sr-only">
                    Name
                </Label>
                <Input
                    id="name"
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
                    id="email"
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

                {errors.password && (
                    <p className="text-destructive text-sm">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full h-11"
                size="lg"
                disabled={isSubmitting}
            >
                Sign up
            </Button>

            <div className="flex items-center text-sm">
                <p>Already have an account?</p>
                <Button
                    type="button"
                    variant="link"
                    className="p-0"
                    onClick={() => setView('sign-in')}
                >
                    Sign in
                </Button>
            </div>
        </form>
    );
};

export default SignUpForm;
