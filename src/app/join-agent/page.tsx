import AgentBenefitsPanel from '@/features/agent/components/AgentBenefitsPanel';
import AgentLoginPanel from '@/features/agent/components/AgentLoginPanel';

const JoinAgent = () => {
    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between min-h-screen">
            <div className="order-2 md:order-1 w-full">
                <AgentBenefitsPanel />
            </div>
            <div className="order-1 flex items-center justify-center p-6 md:order-2 w-full min-h-screen">
                <AgentLoginPanel />
            </div>
        </div>
    );
};

export default JoinAgent;
