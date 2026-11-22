'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
    brokerContactInfoInput,
    brokerContactInfoSchema,
} from '../../schemas/broker-contact-info-zod-schema';
import { brokerFormValues } from '../../types';

interface agencyContactFormProps {
    defaultValues: brokerContactInfoInput;
    onNext: (data: brokerContactInfoInput) => void;
    onBack: (data?: Partial<brokerFormValues>) => void;
}

const BrokerContactInfoForm: React.FC<agencyContactFormProps> = ({
    defaultValues,
    onNext,
    onBack,
}) => {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        resolver: zodResolver(brokerContactInfoSchema),
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
                    id="email"
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
                    id="phone"
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
                    id="website"
                    placeholder="Website"
                    aria-invalid={errors.website ? 'true' : 'false'}
                    {...register('website')}
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
                    {isSubmitting && <Loader className="animate-spin" />}
                    Next <ArrowRight />
                </Button>
            </div>
        </form>
    );
};

export default BrokerContactInfoForm;
