import AgentProfileContent from '@/features/agent/components/agent-profile-content';
import AgentProfileContentSkeleton from '@/features/agent/components/skeleton/agent-profile-content-skeleton';
import { Suspense } from 'react';

const AgentProfile = () => {
    return (
        <main className="max-w-7xl md:px-4 px-2 mx-auto flex flex-col justify-between">
            <Suspense fallback={<AgentProfileContentSkeleton />}>
                <AgentProfileContent />
            </Suspense>
        </main>
    );
};

export default AgentProfile;
