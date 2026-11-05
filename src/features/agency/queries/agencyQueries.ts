import { useMutation } from '@tanstack/react-query';
import { addAgency } from '../actions/agencyActions';
import { toast } from 'sonner';

export const useAddAgency = (onDone?: () => void) => {
    return useMutation({
        mutationFn: addAgency,
        onSuccess: () => {
            toast.success('Agency created');
            onDone?.();
        },
        onError: () => toast.error('Could not create agency'),
    });
};
