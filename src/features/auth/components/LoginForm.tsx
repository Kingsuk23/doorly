import { Eye, EyeClosed, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OrDivider from '@/components/ui/OrDivider';
import SocialButtons from './SocialButtons';
import { Label } from '@/components/ui/label';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';

type FormValues = {
    email: string;
    password: string;
};

interface LoginFormProps {
    onForgotPassword: () => void;
    onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    onForgotPassword,
    onSwitchToSignup,
}) => {
    const [show, setShow] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: { email: '' },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: '/',
        });

        if (error) {
            setError('root', {
                message: error.message ?? 'Invalid email or password',
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
                            id="email"
                            type="email"
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
                        <Button
                            variant="link"
                            type="button"
                            className="h-auto self-start p-0"
                            onClick={() => onForgotPassword()}
                        >
                            Forgotten your password?
                        </Button>
                    </div>
                    {errors.root && (
                        <p
                            role="alert"
                            className="
                    text-destructive text-sm"
                        >
                            {errors.root.message}
                        </p>
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <LoaderCircle size={20} className="animate-spin" />
                        )}
                        Sign in
                    </Button>
                </div>
                <OrDivider label="or" />
                <SocialButtons />
                <div className="flex items-center gap-0.5">
                    <p className="text-sm">New to Doorly?</p>
                    <button
                        className="underline text-sm cursor-pointer"
                        onClick={() => onSwitchToSignup()}
                    >
                        Join for free
                    </button>
                </div>
            </div>
        </form>
    );
};

export default LoginForm;
