import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    agencyAddressInput,
    agencyAddressSchema,
    AgencyFormValues,
} from '../schemas/agencySchema';
import { useAddressComplete } from '@/features/address/hooks/useAddressComplete';
import AddressCombobox from '../../address/components/AddressCombobox';
import { useState } from 'react';

interface agencyAddressFormProps {
    defaultValues: agencyAddressInput;
    onNext: (
        data: agencyAddressInput & {
            lat: undefined | number;
            lon: undefined | number;
        },
    ) => void;
    back: (data?: Partial<AgencyFormValues>) => void;
    coordinates: {
        lat: number | undefined;
        lon: number | undefined;
    };
    setCoordinates: React.Dispatch<
        React.SetStateAction<{
            lat: undefined | number;
            lon: undefined | number;
        }>
    >;
}

const AgencyAddressForm: React.FC<agencyAddressFormProps> = ({
    back,
    defaultValues,
    onNext,
    coordinates,
    setCoordinates,
}) => {
    const [streetInput, setStreetInput] = useState('');

    const [street] = useDebounce(streetInput, 300);
    const { data, isError, isLoading } = useAddressComplete(street);

    const {
        register,
        handleSubmit,
        control,
        setValues,
        getValues,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(agencyAddressSchema),
        mode: 'onChange',
        defaultValues,
    });

    const onSubmit = (data: agencyAddressInput) => {
        onNext({ ...data, ...coordinates });
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="streetLine1" className="sr-only">
                    StreetLine1
                </Label>
                <Controller
                    name="streetLine1"
                    control={control}
                    render={({ field }) => (
                        <AddressCombobox
                            className="h-11"
                            id="agency"
                            options={data?.result ?? []}
                            placeholder="Street line 1"
                            value={field.value}
                            onValueChange={field.onChange}
                            onSearchChange={setStreetInput}
                            isLoading={isLoading}
                            isError={isError}
                            onSelect={(option) => {
                                setValues(
                                    {
                                        city: option.city,
                                        postalCode: option.postcode,
                                    },
                                    { shouldValidate: true },
                                );
                                setCoordinates({
                                    lat: option.lat,
                                    lon: option.lon,
                                });
                            }}
                        />
                    )}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="streetLine2" className="sr-only">
                    StreetLine2
                </Label>
                <Input
                    placeholder="Street line 2 (optional)"
                    aria-invalid={errors.streetLine2 ? 'true' : 'false'}
                    {...register('streetLine2')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="city" className="sr-only">
                    City
                </Label>
                <Input
                    placeholder="City"
                    aria-invalid={errors.city ? 'true' : 'false'}
                    {...register('city')}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="postal code" className="sr-only">
                    Postal code
                </Label>
                <Input
                    placeholder="Postal code"
                    aria-invalid={errors.postalCode ? 'true' : 'false'}
                    {...register('postalCode')}
                />
            </div>

            <div className="flex items-center gap-4 w-full">
                <Button
                    type="button"
                    onClick={() => back({ ...getValues(), ...coordinates })}
                    size="lg"
                    variant="outline"
                    className="flex-1"
                >
                    <ArrowLeft /> Back
                </Button>
                <Button
                    type="submit"
                    disabled={!isValid}
                    size="lg"
                    className="flex-1"
                >
                    Next <ArrowRight />
                </Button>
            </div>
        </form>
    );
};

export default AgencyAddressForm;
