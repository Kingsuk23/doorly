import { useGetListingById } from '../../queries/listing-queries';
import { basicsInput, basicsSchema } from '../../schemas/zod-listings-schema';
import { toast } from '@/components/ui/toast';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormSkeleton from '@/features/properties/components/skeleton/form-skeleton';
import { useEffect } from 'react';
import FieldRow from '@/components/shared/field-row';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LISTING_TYPE } from '../../constants/listing-type';
import { Textarea } from '@/components/ui/textarea';

interface ListingBasicFormProps {
    id: string;
    formId: string;
    onSubmit: (values: basicsInput) => void;
}

const ListingBasicForm = ({ formId, id, onSubmit }: ListingBasicFormProps) => {
    const { data, isPending } = useGetListingById(id);

    const listing = data?.success ? data.data : undefined;

    const {
        handleSubmit,
        control,
        formState: { errors },
        register,
    } = useForm<basicsInput>({
        resolver: zodResolver(basicsSchema),
        defaultValues: {
            description: '',
            listing_type: 'sale',
            title: '',
        },

        values: listing
            ? {
                  description: listing.description ?? '',
                  listing_type: listing.listing_type,
                  title: listing.title ?? '',
              }
            : undefined,
    });

    useEffect(() => {
        if (data && !data.success) {
            toast.add({ type: 'error', description: data.error.message });
        }
    }, [data]);

    if (isPending) return <FormSkeleton />;
    return (
        <form
            id={formId}
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
        >
            <FieldRow
                label="Title"
                htmlFor="title"
                hint="A short, clear headline buyers will see first, e.g. “Spacious 3-bedroom apartment near the city center”."
                required
            >
                <Input
                    placeholder="Title"
                    id="title"
                    {...register('title')}
                    aria-invalid={errors.title ? true : false}
                />
            </FieldRow>
            <FieldRow
                label="Listing type"
                htmlFor="listing_type"
                hint="Choose whether this property is for sale, for rent, etc. You can change it later."
                required
            >
                <Controller
                    name="listing_type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                            items={LISTING_TYPE?.map((t) => ({
                                value: t.value,
                                label: t.label,
                            }))}
                        >
                            <SelectTrigger
                                id="listing_type"
                                aria-invalid={
                                    errors.listing_type ? true : false
                                }
                                className="w-full h-10"
                            >
                                <SelectValue placeholder="Select cooling type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {LISTING_TYPE.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
            </FieldRow>
            <FieldRow
                label="MLS number"
                htmlFor="mls_number"
                hint="The Multiple Listing Service ID for this property. Leave blank if it isn't listed on MLS."
            >
                <Input
                    id="mls_number"
                    placeholder="e.g. 1234567"
                    {...register('mls_number')}
                />
            </FieldRow>
            <FieldRow
                label="Description"
                htmlFor="description"
                hint="Highlight key features, condition, location perks, and anything a buyer should know. Keep it honest and specific."
                required
            >
                <Textarea
                    id="description"
                    {...register('description')}
                    rows={3}
                    placeholder="Description"
                    aria-invalid={errors.description ? true : false}
                />
            </FieldRow>
        </form>
    );
};

export default ListingBasicForm;
