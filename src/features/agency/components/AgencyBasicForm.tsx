import { ArrowRight } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { agencyBasicInput, agencyBasicSchema } from '../schema/agencySchema';
import { useAgencyWizard } from '../hook/useAgencyWizard';

interface AgencyBasicFormProps {
    defaultValues: agencyBasicInput;
    onNext: (data: agencyBasicInput) => void;
}

const AgencyBasicForm: React.FC<AgencyBasicFormProps> = ({
    defaultValues,
    onNext,
}) => {
    const { step, stepIndex, values, next, back, reset, setValues } =
        useAgencyWizard();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(agencyBasicSchema),
        mode: 'onChange',
        defaultValues,
    });

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onNext)}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="sr-only">
                    Name
                </Label>
                <Input
                    placeholder="Name"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    {...register('name')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="license" className="sr-only">
                    License
                </Label>
                <Input
                    placeholder="License number"
                    aria-invalid={errors.license ? 'true' : 'false'}
                    {...register('license')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="description" className="sr-only">
                    Description
                </Label>
                <Textarea
                    placeholder="Description (optional)"
                    aria-invalid={errors.description ? 'true' : 'false'}
                    {...register('description')}
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={!isValid}
                size="lg"
            >
                Next <ArrowRight />
            </Button>
        </form>
    );
};

export default AgencyBasicForm;
