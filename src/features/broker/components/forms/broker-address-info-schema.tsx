import { ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    brokerAddressInfoInput,
    brokerAddressInfoSchema,
} from '../../schemas/broker-address-info-zod-schema';
import { brokerFormValues } from '../../types';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { GeoapifyFormattedAutocompleteJSON } from '@/features/address/types';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item';
import { useAddressSuggestions } from '@/features/address/queries/use-address-suggections';

interface BrokerAddressInfoFormProps {
    defaultValues: brokerAddressInfoInput;
    onNext: (data: brokerAddressInfoInput) => void;
    onBack: (data?: Partial<brokerFormValues>) => void;
}

const BrokerAddressInfoForm = ({
    onBack,
    defaultValues,
    onNext,
}: BrokerAddressInfoFormProps) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: zodResolver(brokerAddressInfoSchema),
        mode: 'onChange',
        defaultValues,
    });

    const street = useWatch({ control, name: 'street_address_1' });

    const { data, isFetching } = useAddressSuggestions(street);

    const suggestions = data?.data ?? [];

    const handleSelect = (item: GeoapifyFormattedAutocompleteJSON | null) => {
        if (!item) return;
        const opts = { shouldValidate: true, shouldDirty: true };

        setValue('street_address_1', item.street ?? item.formatted ?? '', opts);
        setValue('city', item.city ?? item.county ?? '', opts);
        setValue('state', item.state ?? '', opts);
        setValue('zip_code', item.postcode ?? '', opts);
        setValue('country', item.country ?? '', opts);

        setValue('country_code', (item.countryCode ?? '').toUpperCase(), opts);
        setValue('state_code', item.stateCode ?? '', opts);
        setValue('latitude', item.lat, opts);
        setValue('longitude', item.lon, opts);
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onNext)}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="street_address_1" className="sr-only">
                    Street address 1
                </Label>
                <Controller
                    control={control}
                    name="street_address_1"
                    render={({ field }) => (
                        <Combobox
                            items={suggestions}
                            value={null}
                            onValueChange={handleSelect}
                            inputValue={field.value ?? ''}
                            onInputValueChange={(val, details) => {
                                if (details.reason === 'input-change') {
                                    field.onChange(val);
                                }
                            }}
                            filter={null}
                            itemToStringLabel={(
                                i: GeoapifyFormattedAutocompleteJSON | null,
                            ) => i?.street ?? i?.formatted ?? ''}
                        >
                            <ComboboxInput
                                id="street_address_1"
                                placeholder="Street address"
                                aria-invalid={!!errors.street_address_1}
                                className="w-full h-10"
                                showTrigger={false}
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    {isFetching
                                        ? 'Searching...'
                                        : "Can't find your address? Keep what you typed and fill in the fields below."}
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(
                                        item: GeoapifyFormattedAutocompleteJSON,
                                    ) => (
                                        <ComboboxItem
                                            key={item.placeId}
                                            value={item}
                                        >
                                            <Item size="xs" className="p-0">
                                                <ItemContent>
                                                    <ItemTitle className="whitespace-nowrap">
                                                        {item.street ||
                                                            item.formatted}
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        {item.street ||
                                                            item.formatted}
                                                        , {item.city} ,
                                                        {item.postcode}
                                                    </ItemDescription>
                                                </ItemContent>
                                            </Item>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    )}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="street_address_2" className="sr-only">
                    Street address 2
                </Label>
                <Input
                    id="street_address_2"
                    placeholder="Street address 2 (optional)"
                    aria-invalid={errors.street_address_2 ? 'true' : 'false'}
                    {...register('street_address_2')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="city" className="sr-only">
                    City
                </Label>
                <Input
                    id="city"
                    placeholder="City"
                    aria-invalid={errors.city ? 'true' : 'false'}
                    {...register('city')}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="zipcode" className="sr-only">
                    Postal code
                </Label>
                <Input
                    id="zipcode"
                    placeholder="zip code"
                    aria-invalid={errors.zip_code ? 'true' : 'false'}
                    {...register('zip_code')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="state" className="sr-only">
                    State
                </Label>
                <Input
                    id="state"
                    placeholder="State"
                    aria-invalid={errors.state ? 'true' : 'false'}
                    {...register('state')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="country" className="sr-only">
                    Country
                </Label>
                <Input
                    id="country"
                    placeholder="Country"
                    aria-invalid={errors.country ? 'true' : 'false'}
                    {...register('country')}
                />
            </div>

            <div className="flex items-center gap-4 w-full">
                <Button
                    type="button"
                    onClick={() => onBack(getValues())}
                    size="lg"
                    variant="outline"
                    className="flex-1"
                >
                    <ArrowLeft /> Back
                </Button>
                <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    size="lg"
                    className="flex-1"
                >
                    {isSubmitting && <Loader className="animate-spin" />} Next
                    <ArrowRight />
                </Button>
            </div>
        </form>
    );
};

export default BrokerAddressInfoForm;
