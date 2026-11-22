import { Controller, useForm, useWatch } from 'react-hook-form';

import FieldRow from '../field-row';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { capitalizeFirstLetter } from '@/lib/capitalize-first-latter';
import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxEmpty,
    ComboboxList,
    ComboboxItem,
} from '@/components/ui/combobox';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item';
import { useAddressSuggestions } from '@/features/address/queries/use-address-suggections';
import { GeoapifyFormattedAutocompleteJSON } from '@/features/address/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    typeAndLocationInput,
    typeAndLocationSchema,
} from '@/features/properties/schemas/new-property-zod-schemas';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import TypeAndLocationFormSkeleton from '../skeleton/form-skeleton';
import { getPropertyType } from '../../actions/property-type-actions';
import { useGetPropertyById } from '../../queries/use-property';

interface TypeAndLocationFormProps {
    formId: string;
    id: string;
    onSubmit: (values: typeAndLocationInput) => void;
}

const TypeAndLocationForm = ({
    formId,
    id,
    onSubmit,
}: TypeAndLocationFormProps) => {
    const { data: propertyData, isPending } = useGetPropertyById(id);

    const { data: propertyTypesData, isPending: isLoading } = useQuery({
        queryKey: ['get_property_type'],
        queryFn: getPropertyType,
    });

    const propertyTypes = propertyTypesData?.success
        ? propertyTypesData.data
        : [];

    const property = propertyData?.success ? propertyData.data : null;
    const errorMessage =
        propertyData && !propertyData.success
            ? propertyData.error.message
            : null;

    const {
        control,
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(typeAndLocationSchema),
        defaultValues: {
            street_address_1: '',
            city: '',
            country: '',
            parcel_number: '',
            property_type: '',
            state: '',
            street_address_2: '',
            zip_code: '',
        },

        values: property
            ? {
                  property_type: property.property.propertyTypeId ?? '',
                  street_address_1: property.address?.streetLine1 ?? '',
                  street_address_2: property.address?.streetLine2 ?? '',
                  city: property.city?.name ?? '',
                  state: property.state?.name ?? '',
                  zip_code: property.postalCode?.code ?? '',
                  country: property.country?.name ?? '',
                  country_code: property.country?.isoCode ?? '',
                  state_code: property.state?.code ?? '',
                  latitude: property.address?.latitude ?? undefined,
                  longitude: property.address?.longitude ?? undefined,
                  parcel_number: property.property?.parcelNumber ?? '',
              }
            : undefined,
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

    if (isPending) {
        return <TypeAndLocationFormSkeleton />;
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
            className="w-full flex flex-col gap-6"
        >
            <FieldRow
                label="Property type"
                htmlFor="property_type"
                hint="Select the category that best fits this property."
                required
            >
                <Controller
                    control={control}
                    name="property_type"
                    render={({ field }) => (
                        <Select
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                            disabled={isLoading}
                            items={propertyTypes?.map((t) => ({
                                value: t.id,
                                label: capitalizeFirstLetter(t.name),
                            }))}
                        >
                            <SelectTrigger
                                id="property_type"
                                className="w-full"
                                aria-invalid={
                                    errors.property_type ? true : false
                                }
                            >
                                <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {propertyTypes?.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {capitalizeFirstLetter(t.name)}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
            </FieldRow>
            <FieldRow
                label="Street address"
                htmlFor="street_address_1"
                hint="Start typing to search for the address."
                required
            >
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
                            {' '}
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
            </FieldRow>
            <FieldRow
                label="Street address 2"
                htmlFor="street_address_2"
                hint="Apartment, suite, unit, building or floor (optional)."
            >
                <Input
                    id="street_address_2"
                    placeholder="Apt 4B"
                    aria-invalid={errors.street_address_2 ? true : false}
                    {...register('street_address_2')}
                />
            </FieldRow>
            <FieldRow
                label="Country"
                htmlFor="country"
                hint="Country where the property is located."
                required
            >
                <Input
                    id="country"
                    placeholder="Country"
                    autoComplete="country-name"
                    aria-invalid={!!errors.country}
                    {...register('country')}
                />
            </FieldRow>
            <FieldRow
                label="State / Province"
                htmlFor="state"
                hint="State, province or region where the property is located."
                required
            >
                <Input
                    id="state"
                    placeholder="State"
                    autoComplete="address-level1"
                    aria-invalid={!!errors.state}
                    {...register('state')}
                />
            </FieldRow>
            <FieldRow
                label="City"
                htmlFor="city"
                hint="Filled in from the address. You can edit it."
                required
            >
                <Input
                    id="city"
                    placeholder="City"
                    autoComplete="city"
                    aria-invalid={errors.city ? true : false}
                    {...register('city')}
                />
            </FieldRow>
            <FieldRow
                label="PIN code"
                htmlFor="zip_code"
                hint="6-digit postal code of the property."
                required
            >
                <Input
                    id="zip_code"
                    placeholder="e.g. 560038"
                    autoComplete="postal-code"
                    maxLength={6}
                    aria-invalid={errors.zip_code ? true : false}
                    {...register('zip_code')}
                />
            </FieldRow>

            <FieldRow
                label="Parcel number"
                htmlFor="parcel_number"
                hint="Survey or parcel number from the title deed."
            >
                <Input
                    id="parcel_number"
                    placeholder="e.g. KA-BLR-0412-001"
                    maxLength={50}
                    aria-invalid={errors.parcel_number ? true : false}
                    {...register('parcel_number')}
                />
            </FieldRow>
        </form>
    );
};

export default TypeAndLocationForm;
