import { toast } from '@/components/ui/toast';
import { getAgent } from '../actions/agent-actions';
import { redirect } from 'next/navigation';
import AgentProfileCard from './agent-profile-card';

const AgentProfileContent = async () => {
    const result = await getAgent();

    if (!result.success) {
        toast.add({ type: 'error', description: result.error.message });
        return;
    }

    if (!result.data) {
        redirect('/');
        return;
    }
    const { agent, user, broker } = result.data;

    return (
        <div>
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
            />
        </div>
    );
};

export default AgentProfileContent;
