import LogoIcon from '@/components/icons/brand/logo-icon';
import ResetPasswordForm from '@/features/auth/components/forms/reset-password-form';
import ResetPasswordContentSkeleton from '@/features/auth/components/skeletons/reset-password-content-skeleton';
import { Suspense } from 'react';

interface PageProps {
    searchParams: Promise<{
        token?: string;
        error?: string;
        email?: string;
    }>;
}

const ResetPasswordContent = async ({ searchParams }: PageProps) => {
    const { token, error, email } = await searchParams;

    if (error || !token) {
        return (
            <main className="mx-auto max-w-md p-6">
                <p className="text-destructive">
                    This reset link is invalid or has expired.
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-md flex-col p-6">
            <div className="flex size-14 items-center justify-center rounded-lg bg-muted">
                <LogoIcon width={32} height={32} />
            </div>

            <h1 className="mt-2 text-2xl font-bold">Pick a new password</h1>

            <ResetPasswordForm token={token} email={email} />
        </main>
    );
};

const ResetPasswordPage = ({ searchParams }: PageProps) => {
    return (
        <Suspense fallback={<ResetPasswordContentSkeleton />}>
            <ResetPasswordContent searchParams={searchParams} />
        </Suspense>
    );
};

export default ResetPasswordPage;
