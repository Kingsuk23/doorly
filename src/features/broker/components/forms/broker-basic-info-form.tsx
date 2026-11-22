import { useForm } from 'react-hook-form';
import {
    brokerBasicInfoInput,
    brokerBasicInfoSchema,
} from '../../schemas/broker-basic-info-zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';

interface BrokeBasicInfoFromProps {
    defaultValues: brokerBasicInfoInput;
    onNext: (data: brokerBasicInfoInput) => void;
}

const BrokeBasicInfoFrom = ({
    defaultValues,
    onNext,
}: BrokeBasicInfoFromProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        resolver: zodResolver(brokerBasicInfoSchema),
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
                    id="name"
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
                    id="license"
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
                    id="description"
                    placeholder="Description (optional)"
                    aria-invalid={errors.description ? 'true' : 'false'}
                    {...register('description')}
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isSubmitting}
                size="lg"
            >
                {isSubmitting && <Loader className="animate-spin" />} Next
                <ArrowRight />
            </Button>
        </form>
    );
};

export default BrokeBasicInfoFrom;
