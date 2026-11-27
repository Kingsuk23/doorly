import { useGetListingById } from '../../queries/listing-queries';
import { pricingInput, pricingSchema } from '../../schemas/zod-listings-schema';
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
import { z } from 'zod';
import { CURRENCIES } from '../../constants/currencies';

type PricingFormInput = z.input<typeof pricingSchema>;
type PricingFormOutput = z.output<typeof pricingSchema>;

interface ListingPricingFormProps {
    id: string;
    formId: string;
    onSubmit: (values: pricingInput) => void;
}

const ListingPricingForm = ({
    formId,
    id,
    onSubmit,
}: ListingPricingFormProps) => {
    const { data, isPending } = useGetListingById(id);

    const listing = data?.success ? data.data : undefined;

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        register,
    } = useForm<PricingFormInput, unknown, PricingFormOutput>({
        resolver: zodResolver(pricingSchema),
        defaultValues: {
            currency: 'USD',
            price: '',
            price_per_sqft: '',
        },
        values: listing
            ? {
                  currency: listing.currency ?? 'USD',
                  price: listing.price ?? '',
                  price_per_sqft: listing.price_per_sqft ?? '',
              }
            : undefined,
    });

    const areaSqft =
        Number(listing?.property?.livingAreaSqft) ||
        Number(listing?.property?.lotSizeSqft) ||
        0;

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
                label="Price"
                htmlFor="price"
                hint="Enter the total asking price using numbers only, without commas or currency symbols."
                required
            >
                <Input
                    placeholder="Price"
                    id="price"
                    inputMode="decimal"
                    {...register('price', {
                        onChange: (e) => {
                            const price = Number(e.target.value);

                            if (areaSqft > 0 && price > 0) {
                                setValue(
                                    'price_per_sqft',
                                    (price / areaSqft).toFixed(2),
                                    {
                                        shouldValidate: true,
                                    },
                                );
                            } else {
                                setValue('price_per_sqft', '');
                            }
                        },
                    })}
                    aria-invalid={errors.price ? true : false}
                />
            </FieldRow>

            <FieldRow
                label="Currency"
                htmlFor="currency"
                hint="Select the currency the price is listed in."
                required
            >
                <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                            items={CURRENCIES?.map((t) => ({
                                value: t.value,
                                label: t.label,
                            }))}
                        >
                            <SelectTrigger
                                id="currency"
                                aria-invalid={errors.currency ? true : false}
                                className="w-full h-10"
                            >
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {CURRENCIES.map((item) => (
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
                label="Price per sqft"
                htmlFor="price_per_sqft"
                hint="Calculated automatically from the price and property area. You can adjust it if needed."
                required
            >
                <Input
                    inputMode="decimal"
                    id="price_per_sqft"
                    {...register('price_per_sqft')}
                    placeholder="Price per sqft"
                    aria-invalid={errors.price_per_sqft ? true : false}
                />
            </FieldRow>
        </form>
    );
};

export default ListingPricingForm;
