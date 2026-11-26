import TableSkeleton from '@/components/shared/skeleton/table-skeleton';
import AgentProfileCardSkeleton from './agent-profile-card-skeleton';

const AgentProfileContentSkeleton = () => {
    return (
        <>
            <AgentProfileCardSkeleton />
            <TableSkeleton />
        </>
    );
};

export default AgentProfileContentSkeleton;
