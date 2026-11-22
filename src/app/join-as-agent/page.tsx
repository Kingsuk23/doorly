import JoinAsAgentPageContent from '@/features/agent/components/join-as-agent-page-content';
import JoinAsAgentPageContentSkeleton from '@/features/agent/components/skeleton/join-as-agent-page-content-skeleton';
import { Suspense } from 'react';

const JoinAsAgent = () => {
    return (
        <Suspense fallback={<JoinAsAgentPageContentSkeleton />}>
            <JoinAsAgentPageContent />;
        </Suspense>
    );
};

export default JoinAsAgent;
