import { useForm } from 'react-hook-form';
import { useGetPropertyById } from '../../queries/use-property';
import {
    ownershipAndLegalInput,
    ownershipAndLegalSchema,
} from '../../schemas/new-property-zod-schemas';
import FormSkeleton from '../skeleton/form-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import FieldRow from '../../../../components/shared/field-row';
import { Input } from '@/components/ui/input';

interface OwnerAndLegalFormProps {
    formId: string;
    id: string;
    onSubmit: (values: ownershipAndLegalInput) => void;
}

const OwnerAndLegalForm = ({
    formId,
    id,
    onSubmit,
}: OwnerAndLegalFormProps) => {
    const { data: propertyData, isPending } = useGetPropertyById(id);

    const property = propertyData?.success ? propertyData.data : null;
    const errorMessage =
        propertyData && !propertyData.success
            ? propertyData.error.message
            : null;

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ownershipAndLegalSchema),
        defaultValues: {
            hoa_name: '',
            owner_name: '',
            zoning: '',
        },

        values: property
            ? {
                  hoa_name: property?.property.hoaName ?? '',
                  owner_name: property?.property?.ownerName ?? '',
                  zoning: property?.property?.zoning ?? '',
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
            id={formId}
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
        >
            <FieldRow
                htmlFor="owner_name"
                label="Owner name"
                hint="Legal owner name as on the property record."
            >
                <Input
                    id="owner_name"
                    placeholder="e.g. Rajesh Kumar"
                    maxLength={100}
                    aria-invalid={errors.owner_name ? true : false}
                    {...register('owner_name')}
                />
            </FieldRow>

            <FieldRow
                htmlFor="hoa_name"
                label="HOA name"
                hint="Homeowners association or society, if any."
            >
                <Input
                    id="hoa_name"
                    placeholder="e.g. Sea Breeze Co-operative Society"
                    maxLength={100}
                    aria-invalid={errors.hoa_name ? true : false}
                    {...register('hoa_name')}
                />
            </FieldRow>

            <FieldRow
                htmlFor="zoning"
                label="Zoning"
                hint="Land-use category, such as Residential (R)."
            >
                <Input
                    id="zoning"
                    placeholder="e.g. Residential (R)"
                    maxLength={50}
                    aria-invalid={errors.zoning ? true : false}
                    {...register('zoning')}
                />
            </FieldRow>
        </form>
    );
};

export default OwnerAndLegalForm;
