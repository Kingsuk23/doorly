import { toast } from '@/components/ui/toast';
import { getAgent } from '../actions/agent-actions';
import { redirect } from 'next/navigation';
import AgentBenefitsPanel from './agent-benefit-panel';
import AgentCreationPanel from './agent-creation-panel';

const JoinAsAgentPageContent = async () => {
    const agent = await getAgent();

    if (!agent.success) {
        toast.add({
            type: 'error',
            description: agent.error.message,
        });
        return;
    }

    if (agent.data) {
        redirect('/agent-profile');
    }
    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between min-h-screen">
            <div className="order-2 md:order-1 w-full">
                <AgentBenefitsPanel />
            </div>
            <div className="order-1 flex items-center justify-center p-6 md:order-2 w-full min-h-screen">
                <AgentCreationPanel />
            </div>
        </div>
    );
};

export default JoinAsAgentPageContent;
