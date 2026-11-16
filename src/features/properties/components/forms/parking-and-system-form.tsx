import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
    parkingAndSystemInput,
    parkingAndSystemSchema,
} from '../../schemas/new-property-zod-schemas';
import { useGetPropertyById } from '../../queries/use-property';
import FormSkeleton from '../skeleton/form-skeleton';
import FieldRow from '../field-row';
import NumberStepper from '../number-stepper';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    COOLING_OPTIONS,
    HEATING_OPTIONS,
} from '../../constants/system-options';

interface ParkingAndSystemProps {
    formId: string;
    id: string;
    onSubmit: (values: parkingAndSystemInput) => void;
}

const ParkingAndSystemForm = ({
    formId,
    id,
    onSubmit,
}: ParkingAndSystemProps) => {
    const { data: propertyData, isPending } = useGetPropertyById(id);

    const property = propertyData?.success ? propertyData.data : null;
    const errorMessage =
        propertyData && !propertyData.success
            ? propertyData.error.message
            : null;

    const {
        handleSubmit,

        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(parkingAndSystemSchema),
        defaultValues: {
            cooling_type: '',
            garage_spaces: undefined,
            parking_spaces: undefined,
            heating_type: '',
        },

        values: property
            ? {
                  cooling_type: property?.property?.coolingType ?? '',
                  heating_type: property?.property?.heatingType ?? '',
                  garage_spaces: property?.property?.garageSpaces ?? 0,
                  parking_spaces: property?.property?.parkingSpaces ?? 0,
              }
            : undefined,
    });

    if (isPending) return <FormSkeleton />;

    if (errorMessage) {
        return (
            <div className="rounded-md border p-4 text-sm text-destructive">
                {errorMessage}
            </div>
        );
    }
    return (
        <form
            className="flex flex-col gap-6"
            id={formId}
            onSubmit={handleSubmit(onSubmit)}
        >
            <FieldRow
                htmlFor="parking_spaces"
                label="Parking spaces"
                hint="Total parking spots, including the garage."
            >
                <Controller
                    name="parking_spaces"
                    control={control}
                    render={({ field }) => (
                        <NumberStepper
                            label="parking_spaces"
                            value={field.value ?? 0}
                            onChange={field.onChange}
                            min={0}
                            max={20}
                            aria-invalid={errors.parking_spaces ? true : false}
                        />
                    )}
                />
            </FieldRow>
            <FieldRow
                htmlFor="garage_spaces"
                label="Garage spaces"
                hint="Covered garage spots only."
            >
                <Controller
                    name="garage_spaces"
                    control={control}
                    render={({ field }) => (
                        <NumberStepper
                            label="garage_spaces"
                            value={field.value ?? 0}
                            onChange={field.onChange}
                            min={0}
                            max={20}
                            aria-invalid={errors.garage_spaces ? true : false}
                        />
                    )}
                />
            </FieldRow>
            <FieldRow
                htmlFor="cooling_type"
                label="Cooling type"
                hint="Main cooling system in the property."
            >
                <Controller
                    name="cooling_type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                            items={COOLING_OPTIONS?.map((t) => ({
                                value: t.value,
                                label: t.label,
                            }))}
                        >
                            <SelectTrigger
                                id="cooling_type"
                                aria-invalid={
                                    errors.cooling_type ? true : false
                                }
                                className="w-full h-10"
                            >
                                <SelectValue placeholder="Select cooling type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {COOLING_OPTIONS.map((cooling) => (
                                        <SelectItem
                                            key={cooling.value}
                                            value={cooling.value}
                                        >
                                            {cooling.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
            </FieldRow>

            <FieldRow
                htmlFor="heating_type"
                label="Heating type"
                hint="Main heating system in the property."
            >
                <Controller
                    name="heating_type"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                            items={HEATING_OPTIONS?.map((t) => ({
                                value: t.value,
                                label: t.label,
                            }))}
                        >
                            <SelectTrigger
                                id="heating_type"
                                aria-invalid={
                                    errors.heating_type ? true : false
                                }
                                className=" w-full h-11"
                            >
                                <SelectValue placeholder="Select heating type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {HEATING_OPTIONS.map((heating) => (
                                        <SelectItem
                                            key={heating.value}
                                            value={heating.value}
                                        >
                                            {heating.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                />
            </FieldRow>
        </form>
    );
};

export default ParkingAndSystemForm;
