'use client';
import Link from 'next/link';
import Logo from '@/components/icons/brand/Logo';
import { authClient } from '@/lib/auth-client';
import AgentApplyForm from './AgentApplyForm';
import { useAuthModal } from '@/features/auth/store/authModal';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LockKeyhole, LogIn } from 'lucide-react';
import { useGetAgent } from '../queries/agentQueries';
import { useRouter } from 'next/navigation';

const AgentCreationPanel = () => {
    const { data: session, isPending } = authClient.useSession();
    const open = useAuthModal((s) => s.open);
    const setRedirectUrl = useAuthModal((s) => s.setRedirectUrl);
    const router = useRouter();

    const { data: agent, isLoading: agentLoading } = useGetAgent();

    useEffect(() => {
        if (isPending) return;
        if (!session) {
            setRedirectUrl('/join-agent');
            open('sign-in');
        }
    }, [isPending, session, open, setRedirectUrl]);

    useEffect(() => {
        if (agentLoading) return;
        if (agent) router.replace('/profile');
    }, [agent, agentLoading, router]);

    if (!session)
        return (
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border bg-card p-8 text-center shadow-sm">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
                    <LockKeyhole className="size-7 text-primary" />
                </div>

                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold tracking-tight">
                        Sign in to continue
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        You need an account to apply as an agent. It only takes
                        a minute to sign in or create one.
                    </p>
                </div>

                <Button
                    size="lg"
                    className="w-full"
                    onClick={() => open('sign-in')}
                >
                    <LogIn className="size-4" />
                    Sign in
                </Button>

                <p className="text-xs text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <button
                        type="button"
                        onClick={() => open('sign-up')}
                        className="font-medium text-primary underline-offset-4 hover:underline cursor-pointer"
                    >
                        Create one
                    </button>
                </p>
            </div>
        );
    return (
        <div className="w-full max-w-sm">
            <Link href="/" aria-label="Home" className="inline-block md:hidden">
                <Logo height={42} />
            </Link>

            <h2 className="mb-6 mt-10 text-2xl font-semibold">
                Complete your agent profile
            </h2>

            <AgentApplyForm />
        </div>
    );
};

export default AgentCreationPanel;
