import { Controller, useForm } from 'react-hook-form';
import { useGetPropertyById } from '../../queries/use-property';
import {
    sizeAndLayoutInput,
    sizeAndLayoutSchema,
} from '../../schemas/new-property-zod-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import FieldRow from '../field-row';
import NumberStepper from '../number-stepper';
import YearPicker from '../year-picker';
import { Input } from '@/components/ui/input';
import { toNumber } from '@/lib/to-number';
import { useEffect } from 'react';
import FormSkeleton from '../skeleton/form-skeleton';

interface SizeAndLayoutProps {
    formId: string;
    id: string;
    onSubmit: (values: sizeAndLayoutInput) => void;
}

const SizeAndLayoutForm = ({ formId, id, onSubmit }: SizeAndLayoutProps) => {
    const { data: propertyData, isPending } = useGetPropertyById(id);

    const property = propertyData?.success ? propertyData.data : null;
    const errorMessage =
        propertyData && !propertyData.success
            ? propertyData.error.message
            : null;

    const {
        handleSubmit,
        control,
        register,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(sizeAndLayoutSchema),
        defaultValues: {
            bathrooms: 0,
            bedrooms: 0,
            build_year: undefined,
            floors: 0,
            living_area: undefined,
            lot_size: undefined,
        },
    });

    useEffect(() => {
        if (!property) return;
        reset({
            bathrooms: toNumber(property.property.bathrooms) ?? 0,
            bedrooms: property.property.bedrooms ?? 0,
            build_year: toNumber(property.property.yearBuilt),
            floors: property.property.floors ?? 0,
            living_area: property.property.livingAreaSqft ?? '',
            lot_size: property.property.lotSizeSqft ?? '',
        });
    }, [property, reset]);

    if (isPending) {
        return <FormSkeleton />;
    }

    if (errorMessage) {
        return (
            <div className="rounded-md border p-4 text-sm text-destructive">
                {errorMessage}
            </div>
        );
    }

    return (
        <form
            id={formId}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
        >
            <FieldRow
                htmlFor="bedrooms"
                label="Bedrooms"
                hint="Total number of bedrooms in the property."
                required
            >
                <Controller
                    name="bedrooms"
                    control={control}
                    render={({ field }) => (
                        <NumberStepper
                            label="bedrooms"
                            value={field.value}
                            onChange={field.onChange}
                            min={0}
                            max={10}
                            aria-invalid={errors.bedrooms ? true : false}
                        />
                    )}
                />
            </FieldRow>
            <FieldRow
                htmlFor="bathrooms"
                label="Bathrooms"
                hint="Total number of bathrooms in the property."
                required
            >
                <Controller
                    name="bathrooms"
                    control={control}
                    render={({ field }) => (
                        <NumberStepper
                            label="bathrooms"
                            value={field.value}
                            onChange={field.onChange}
                            min={0}
                            max={10}
                            step={0.5}
                            aria-invalid={errors.bathrooms ? true : false}
                        />
                    )}
                />
            </FieldRow>
            <FieldRow
                htmlFor="floors"
                label="Floors"
                hint="Total number of floors in the property."
            >
                <Controller
                    name="floors"
                    control={control}
                    render={({ field }) => (
                        <NumberStepper
                            label="floors"
                            value={field.value ?? 0}
                            onChange={field.onChange}
                            min={0}
                            max={100}
                            aria-invalid={errors.floors ? true : false}
                        />
                    )}
                />
            </FieldRow>
            <FieldRow
                htmlFor="build_year"
                label="Build year"
                hint="Year the property was originally built."
                required
            >
                <Controller
                    name="build_year"
                    control={control}
                    render={({ field }) => (
                        <YearPicker
                            id="build_year"
                            value={field.value}
                            onChange={field.onChange}
                            aria-invalid={errors.build_year ? true : false}
                        />
                    )}
                />
            </FieldRow>
            <FieldRow
                label="Living area (sq ft)"
                htmlFor="living_area"
                hint="Interior floor area in square feet only."
                required
            >
                <Input
                    id="living_area"
                    placeholder="e.g. 1200"
                    aria-invalid={errors.living_area ? true : false}
                    {...register('living_area')}
                />
            </FieldRow>
            <FieldRow
                label="Lot size (sq ft)"
                htmlFor="lot_size"
                hint="Total land area in square feet, with yard."
            >
                <Input
                    id="lot_size"
                    placeholder="e.g. 2400"
                    {...register('lot_size')}
                    aria-invalid={errors.lot_size ? true : false}
                />
            </FieldRow>
        </form>
    );
};

export default SizeAndLayoutForm;
