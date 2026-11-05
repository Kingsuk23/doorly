import { useState } from 'react';
import { AgencyFormValues, emptyAgencyForm } from '../schemas/agencySchema';

const steps = ['basic', 'contact', 'address', 'logo'] as const;

export const useAgencyWizard = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [values, setValues] = useState<AgencyFormValues>(emptyAgencyForm);
    const [coordinates, setCoordinates] = useState<{
        lat: number | undefined;
        lon: number | undefined;
    }>({ lat: undefined, lon: undefined });

    const next = (data: Partial<AgencyFormValues>) => {
        setValues((prev) => ({ ...prev, ...data }));
        setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    };
    const back = (data?: Partial<AgencyFormValues>) => {
        if (data) setValues((prev) => ({ ...prev, ...data }));
        setStepIndex((i) => Math.max(i - 1, 0));
    };
    const reset = () => {
        setValues(emptyAgencyForm);
        setStepIndex(0);
    };

    return {
        step: steps[stepIndex],
        stepIndex,
        values,
        next,
        back,
        reset,
        coordinates,
        setCoordinates,
        setValues,
    };
};
