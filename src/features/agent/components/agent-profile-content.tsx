import { toast } from '@/components/ui/toast';
import { getAgent } from '../actions/agent-actions';
import { redirect } from 'next/navigation';
import AgentProfileCard from './agent-profile-card';
import ListingDataTable from './table/listing-data-table';
import { listingColumns } from './table/listing-columns';
import { getListingByAgentUserId } from '@/features/listings/actions/listing-action';

const AgentProfileContent = async () => {
    const [result, listingData] = await Promise.all([
        getAgent(),
        getListingByAgentUserId(),
    ]);

    if (!result.success) {
        toast.add({ type: 'error', description: result.error.message });
        return;
    }

    if (!listingData?.success) {
        toast.add({
            type: 'error',
            description: listingData.error.message,
        });
        return;
    }

    if (!result.data) {
        redirect('/');
        return;
    }
    const { agent, user, broker } = result.data;

    return (
        <>
            <AgentProfileCard
                avatar={user?.image ?? undefined}
                rawName={user?.name ?? ''}
                role={agent.brokerRole}
                isVerified={agent.isVerified ?? false}
                bio={agent.bio}
                email={agent.email}
                phone={agent.phone}
                license={agent.license}
                website={agent.website ?? undefined}
                createdAt={agent?.createdAt}
                brokerName={broker?.name ?? ''}
                agentId={agent?.id}
                avatarId={user?.imageId}
                id={user?.id}
            />

            <ListingDataTable
                columns={listingColumns}
                data={listingData.data}
            />
        </>
    );
};

export default AgentProfileContent;
