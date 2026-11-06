import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { addAgency, getAllAgency } from '../actions/agencyActions';
import { toast } from 'sonner';

export const useAddAgency = (onSuccess?: (id: string) => void) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addAgency,
        onSuccess: (id) => {
            toast.success('Agency created');
            qc.invalidateQueries({ queryKey: ['fetch_all_agency'] });
            onSuccess?.(id);
        },
        onError: () => toast.error('Could not create agency'),
    });
};

export const useGetAgency = () => {
    return useQuery({
        queryKey: ['fetch_all_agency'],
        queryFn: getAllAgency,
        staleTime: 5 * 60_000,
        placeholderData: keepPreviousData,
    });
};
