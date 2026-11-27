import { useForm, useWatch } from 'react-hook-form';
import {
    descriptionInput,
    descriptionSchema,
} from '../../schemas/new-property-zod-schemas';
import FormSkeleton from '../skeleton/form-skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetPropertyById } from '../../queries/use-property';
import FieldRow from '../../../../components/shared/field-row';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionFormProps {
    id: string;
    formId: string;
    onSubmit: (values: descriptionInput) => void;
}

const DescriptionForm = ({ formId, id, onSubmit }: DescriptionFormProps) => {
    const { data: propertyData, isPending } = useGetPropertyById(id);

    const property = propertyData?.success ? propertyData.data : null;
    const errorMessage =
        propertyData && !propertyData.success
            ? propertyData.error.message
            : null;

    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(descriptionSchema),
        defaultValues: {
            description: '',
        },

        values: property
            ? {
                  description: property?.property?.description ?? '',
              }
            : undefined,
    });

    const description = useWatch({
        control,
        name: 'description',
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
                htmlFor="description"
                label="Description"
                hint="Mention the area, upgrades and standout features."
            >
                <Textarea
                    id="description"
                    rows={6}
                    maxLength={5000}
                    placeholder="e.g. Bright 3 BHK close to the metro, with a modular kitchen, covered parking and a quiet park-facing balcony."
                    aria-invalid={errors.description ? true : false}
                    className="resize-y"
                    {...register('description')}
                />
                <div className="mt-1.5 flex justify-between text-xs">
                    <span className="text-destructive">
                        {errors.description?.message}
                    </span>
                    <span className="text-muted-foreground">
                        {description?.length} / 5000
                    </span>
                </div>
            </FieldRow>
        </form>
    );
};

export default DescriptionForm;
