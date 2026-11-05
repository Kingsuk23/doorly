'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
    agencyContactInput,
    agencyContactSchema,
    AgencyFormValues,
} from '../schemas/agencySchema';

interface agencyContactFormProps {
    defaultValues: agencyContactInput;
    onNext: (data: agencyContactInput) => void;
    back: (data?: Partial<AgencyFormValues>) => void;
}

const AgencyContactForm: React.FC<agencyContactFormProps> = ({
    defaultValues,
    onNext,
    back,
}) => {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(agencyContactSchema),
        mode: 'onChange',
        defaultValues,
    });

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onNext)}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="sr-only">
                    Email
                </Label>
                <Input
                    placeholder="Email"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    {...register('email')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="sr-only">
                    Phone
                </Label>
                <Input
                    placeholder="Phone"
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    {...register('phone')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="website" className="sr-only">
                    Website
                </Label>
                <Input
                    placeholder="Website"
                    aria-invalid={errors.website ? 'true' : 'false'}
                    {...register('website')}
                />
            </div>

            <div className="flex items-center gap-4 w-full">
                <Button
                    type="button"
                    onClick={() => back(getValues())}
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

export default AgencyContactForm;
