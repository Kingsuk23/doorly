import { DatePicker } from '@/components/shared/date-picker';
import FieldRow from '@/components/shared/field-row';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
    scheduleSchema,
    scheduleInput,
} from '../../schemas/zod-listings-schema';
import { useEffect } from 'react';
import { useGetListingById } from '../../queries/listing-queries';
import { toast } from '@/components/ui/toast';
import FormSkeleton from '@/features/properties/components/skeleton/form-skeleton';

interface ListingScheduleFormProps {
    formId: string;
    id: string;
    onSubmit: (values: scheduleInput) => void;
}

const ListingScheduleForm = ({
    formId,
    id,
    onSubmit,
}: ListingScheduleFormProps) => {
    const { data, isPending } = useGetListingById(id);

    const listing = data?.success ? data.data : undefined;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            listed_at: '',
            expires_at: '',
        },
        values: listing
            ? {
                  listed_at: listing.listed_at ?? '',
                  expires_at: listing.expires_at ?? '',
              }
            : undefined,
    });

    const listedAt = useWatch({ control, name: 'listed_at' }) as
        | Date
        | undefined;

    useEffect(() => {
        if (data && !data.success) {
            toast.add({ type: 'error', description: data.error.message });
        }
    }, [data]);

    if (isPending) return <FormSkeleton />;
    return (
        <form
            className="flex flex-col gap-6"
            id={formId}
            onSubmit={handleSubmit(onSubmit)}
        >
            <FieldRow
                label="Listed date"
                htmlFor="listed_at"
                hint="The date this listing goes live."
                required
            >
                <Controller
                    name="listed_at"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            id="listed_at"
                            value={field.value as Date | undefined}
                            onChange={field.onChange}
                            placeholder="Select listed date"
                            invalid={!!errors.listed_at}
                        />
                    )}
                />
            </FieldRow>

            <FieldRow
                label="Expiry date"
                htmlFor="expires_at"
                hint="The listing is automatically hidden after this date."
                required
            >
                <Controller
                    name="expires_at"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            id="expires_at"
                            value={field.value as Date | undefined}
                            onChange={field.onChange}
                            placeholder="Select expiry date"
                            disabled={(date) =>
                                !!listedAt && date < new Date(listedAt)
                            }
                            invalid={!!errors.expires_at}
                        />
                    )}
                />
            </FieldRow>
        </form>
    );
};

export default ListingScheduleForm;
