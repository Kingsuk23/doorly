import AgencyModal from '@/features/agency/components/AgencyModal';
import { useAgencyWizard } from '@/features/agency/hooks/useAgencyWizard';
import { useGetAgency } from '@/features/agency/queries/agencyQueries';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from 'cn';
import { Controller, useForm } from 'react-hook-form';
import {
    applyAgentBasicSchema,
    ApplyAgentBasicInput,
} from '../schemas/agentApplySchema';
import { getFileKey } from '@/lib/uploadthing/utils';
import { deleteUpload } from '@/components/uploadthing/actions/deleteUpload';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AgencyCombobox from '@/features/agency/components/AgencyCombobox';
import { Button } from '@/components/ui/button';
import SelectField from '@/components/shared/SelectField';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { agentPosition } from '@/features/search/constants/agentOwner';

interface AgentBasicInfoFormProps {
    className?: string;
    onNext: (data: ApplyAgentBasicInput) => void;
}

const AgentBasicInfoForm: React.FC<AgentBasicInfoFormProps> = ({
    className,
    onNext,
}) => {
    const { data: agencies, isLoading, isError } = useGetAgency();
    const {
        imageUrlAgency,
        setImageUrlAgency,
        agencyModalOpen,
        setAgencyModalOpen,
    } = useAgencyWizard();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        resolver: zodResolver(applyAgentBasicSchema),
        mode: 'onChange',
        defaultValues: {
            agencyRole: 'agent',
        },
    });

    const agency = watch('agency');

    const CloseHandler = async (open: boolean) => {
        setAgencyModalOpen(open);
        if (!open && imageUrlAgency) {
            const key = getFileKey(imageUrlAgency);

            if (key) {
                await deleteUpload(key).catch(console.error);
            }
            setImageUrlAgency('');
        }
    };
    return (
        <>
            <form
                className={cn('mt-2 flex flex-col gap-4', className)}
                onSubmit={handleSubmit(onNext)}
            >
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
                    <div className="flex flex-col items-start gap-0.5">
                        <Controller
                            name="agency"
                            control={control}
                            render={({ field }) => (
                                <AgencyCombobox
                                    className="h-11"
                                    id="agency"
                                    agencies={agencies}
                                    isError={isError}
                                    isLoading={isLoading}
                                    placeholder="Select agency"
                                    value={field.value}
                                    onValueChange={field.onChange}
                                />
                            )}
                        />

                        <Button
                            type="button"
                            variant="link"
                            size="xs"
                            onClick={() => setAgencyModalOpen(true)}
                        >
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
                                disabled={agency === undefined ? true : false}
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
                    disabled={isSubmitting || !isValid}
                >
                    Next <ArrowRight />
                </Button>
            </form>
            <AgencyModal
                open={agencyModalOpen}
                onOpenChange={CloseHandler}
                onAgencyCreated={(id) => {
                    setValue('agency', id, {
                        shouldValidate: true,
                        shouldDirty: true,
                    });
                }}
            />
        </>
    );
};

export default AgentBasicInfoForm;
