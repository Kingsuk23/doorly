import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeClosed } from 'lucide-react';

import { authClient } from '@/lib/auth/auth-client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthView } from '../../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinInput, signinSchema } from '../../schemas/auth-zod-schemas';
import { toast } from '@/components/ui/toast';

interface LoginFormProps {
    setView: (view: AuthView) => void;
}

const SignInForm: React.FC<LoginFormProps> = ({ setView }) => {
    const [show, setShow] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(signinSchema),
    });

    const onSubmit = async (data: signinInput) => {
        const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: '/',
        });

        if (error) {
            toast.add({
                type: 'error',
                description: error.message ?? 'Invalid credentials',
            });
            return;
        }
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
                                className="p-0"
                                onClick={() => setShow((prev) => !prev)}
                            >
                                {show ? (
                                    <EyeClosed size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </Button>
                        </div>
                        <Button
                            variant="link"
                            type="button"
                            className="h-auto self-start p-0"
                            onClick={() => setView('forgot')}
                        >
                            Forgotten your password?
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        Sign in
                    </Button>
                </div>

                <div className="flex items-center">
                    <p className="text-sm">New to Doorly?</p>
                    <Button
                        type="button"
                        variant="link"
                        className="p-0 font-semibold text-sm"
                        onClick={() => setView('sign-up')}
                    >
                        Join for free
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default SignInForm;
