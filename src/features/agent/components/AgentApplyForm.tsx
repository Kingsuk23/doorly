import { useState } from 'react';
import AgentBasicInfoForm from './AgentBasicInfoForm';
import { AgentFormValues, emptyAgentForm } from '../schemas/agentApplySchema';
import AgentProfileImage from './AgentProfileImage';

interface AgentApplyFormProps {
    className?: string;
}
const steps = ['basic', 'image'] as const;

const AgentApplyForm: React.FC<AgentApplyFormProps> = ({ className }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [values, setValues] = useState<AgentFormValues>(emptyAgentForm);

    const next = (data: Partial<AgentFormValues>) => {
        setValues((prev) => ({ ...prev, ...data }));
        setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    };
    const back = (data?: Partial<AgentFormValues>) => {
        if (data) setValues((prev) => ({ ...prev, ...data }));
        setStepIndex((i) => Math.max(i - 1, 0));
    };
    const reset = () => {
        setValues(emptyAgentForm);
        setStepIndex(0);
    };

    return (
        <div className={className}>
            {steps[stepIndex] === 'basic' && (
                <AgentBasicInfoForm onNext={next} />
            )}
            {steps[stepIndex] === 'image' && (
                <AgentProfileImage
                    onBack={back}
                    values={values}
                    reset={reset}
                />
            )}
        </div>
    );
};

export default AgentApplyForm;
