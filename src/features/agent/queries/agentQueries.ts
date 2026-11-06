import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addAgent, getAgent } from '../actions/agentActions';
import { toast } from 'sonner';

export const useAddAgent = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addAgent,
        onSuccess: () => {
            toast.success('Agency created');
            qc.invalidateQueries({ queryKey: ['agent'] });
        },
        onError: () => toast.error('Could not create agency'),
    });
};

export const useGetAgent = () => {
    return useQuery({
        queryKey: ['agent'],
        queryFn: getAgent,
        staleTime: 5 * 60_000,
    });
};
