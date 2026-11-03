'use client';
import Link from 'next/link';
import Logo from '@/components/icons/brand/Logo';
import SignUpForm from '@/features/auth/components/SignUpForm';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth-client';
import AgentApplyForm from './AgentApplyForm';

const AgentLoginPanel = () => {
    const { data: session, isPending } = authClient.useSession();

    return (
        <div className="w-full max-w-sm">
            <Link href="/" aria-label="Home" className="inline-block md:hidden">
                <Logo height={42} />
            </Link>

            <h2 className="mb-6 mt-10 text-2xl font-semibold">
                {session
                    ? 'Complete your agent profile'
                    : 'Create your agent account'}
            </h2>

            {isPending ? (
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : session ? (
                <AgentApplyForm />
            ) : (
                <SignUpForm redirectUrl="/join-agent" className="w-full" />
            )}
        </div>
    );
};

export default AgentLoginPanel;
