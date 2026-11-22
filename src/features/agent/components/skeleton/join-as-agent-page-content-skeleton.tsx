import AgentApplyFormSkeleton from './agent-apply-form-skeleton';
import AgentBenefitsPanelSkeleton from './agent-benefit-panel-skeleton';

const JoinAsAgentPageContentSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between min-h-screen">
            <div className="order-2 md:order-1 w-full">
                <AgentBenefitsPanelSkeleton />
            </div>
            <div className="order-1 flex items-center justify-center p-6 md:order-2 w-full min-h-screen">
                <AgentApplyFormSkeleton />
            </div>
        </div>
    );
};

export default JoinAsAgentPageContentSkeleton;
