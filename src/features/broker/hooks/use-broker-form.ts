'use client';

import { useState } from 'react';

import { steps } from '../constants/broker-form-steps';
import { brokerFormValues } from '../types';
import { emptyBrokerInfoForm } from '../services/broker-empty-values';

export const useBrokerForm = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [values, setValues] = useState<brokerFormValues>(emptyBrokerInfoForm);
    const [brokerAvatarId, setBrokerAvatarId] = useState<string | null>(null);
    const [brokerModalOpen, setBrokerModalOpen] = useState(false);

    const next = (data: Partial<brokerFormValues>) => {
        setValues((prev) => ({ ...prev, ...data }));
        setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    };
    const back = (data?: Partial<brokerFormValues>) => {
        if (data) setValues((prev) => ({ ...prev, ...data }));
        setStepIndex((i) => Math.max(i - 1, 0));
    };
    const reset = () => {
        setValues(emptyBrokerInfoForm);
        setStepIndex(0);
    };

    return {
        step: steps[stepIndex],
        stepIndex,
        values,
        next,
        back,
        reset,
        setValues,
        brokerModalOpen,
        brokerAvatarId,
        setBrokerAvatarId,
        setBrokerModalOpen,
    };
};
