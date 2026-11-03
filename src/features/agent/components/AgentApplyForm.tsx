import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ApplyAgentInput, applyAgentSchema } from '../schema/agentApplySchema';
import { cn } from 'cn';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import SelectField from '@/components/shared/SelectField';
import { agentPosition } from '@/features/search/constants/agentOwner';
import Combobox from '@/components/shared/Combobox';

interface AgentApplyFormProps {
    className?: string;
}

export const agencies = [
    {
        value: '1',
        label: 'Sunrise Realty',
    },
    { value: '2', label: 'Oak & Pine Homes' },
    { value: '3', label: 'Bluebird Estates' },
    { value: '4', label: 'Harbor View Properties' },
];

const AgentApplyForm: React.FC<AgentApplyFormProps> = ({ className }) => {
    const [imageUrl, setImageUrl] = useState<string>('');

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(applyAgentSchema) });

    const onSubmit = async (data: ApplyAgentInput) => {
        // const { error } = await authClient.signUp.email({
        //     name: data.name,
        //     email: data.email,
        //     password: data.password,
        //     callbackURL: redirectUrl,
        // });
        // if (error) {
        //     toast.error(error.message ?? 'Could not create account');
        //     return;
        // }
        // toast.success('Verification email sent', {
        //     description: `Check ${data.email} to verify your account.`,
        // });
        // reset();
        // onClose?.();
        console.log(data);
    };

    const agency = watch('agency');
    return (
        <form
            className={cn('mt-2', className)}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="license" className="sr-only">
                            License
                        </Label>
                        <Input
                            placeholder="License"
                            aria-invalid={errors.license ? 'true' : 'false'}
                            {...register('license')}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="bio" className="sr-only">
                            Bio (optional)
                        </Label>
                        <Textarea
                            placeholder="Bio (optional)"
                            id="bio"
                            rows={3}
                            className="rounded-md border bg-transparent p-3 text-sm"
                            aria-invalid={errors.bio ? 'true' : 'false'}
                            {...register('bio')}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="agency" className="sr-only">
                            Agency
                        </Label>
                        <div className="flex flex-col items-start gap-0.5 text-xs">
                            <Controller
                                name="agency"
                                control={control}
                                render={({ field }) => (
                                    <Combobox
                                        className="h-11"
                                        id="agency"
                                        options={agencies}
                                        placeholder="Select agency"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    />
                                )}
                            />

                            <Button variant="link" size="xs" type="button">
                                Can&apos;t find your agency? Add it here
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="agencyRole" className="sr-only">
                            Position
                        </Label>
                        <Controller
                            control={control}
                            name="agencyRole"
                            render={({ field }) => (
                                <SelectField
                                    options={agentPosition}
                                    placeholder="Select position"
                                    value={field.value}
                                    defaultValue=""
                                    disabled={
                                        agency === undefined ? true : false
                                    }
                                    onValueChange={field.onChange}
                                    className="w-full data-[size=default]:h-11"
                                    ariaLabel="agencyRole"
                                    triggerProps={{ id: 'agencyRole' }}
                                />
                            )}
                        />
                    </div>
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
                            Website (Optional)
                        </Label>
                        <Input
                            placeholder="Website (Optional)"
                            aria-invalid={errors.website ? 'true' : 'false'}
                            {...register('website')}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <LoaderCircle size={20} className="animate-spin" />
                        )}
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default AgentApplyForm;
