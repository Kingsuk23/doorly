'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
    agentApplyFormInput,
    agentApplyFormSchema,
} from '../schema/agent-zod-schema';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectGroup,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { brokerRoles } from '../constants/broker-role';
import { Textarea } from '@/components/ui/textarea';
import { Loader } from 'lucide-react';
import { useBrokerForm } from '@/features/broker/hooks/use-broker-form';
import BrokerModal from '@/features/broker/components/broker-modal';
import { deleteImageKitFile } from '@/features/dropzone/services/image-kit-delete-file';
import { toast } from '@/components/ui/toast';
import { useGetAllBroker } from '@/features/broker/quries/use-broker';
import { capitalizeFirstLetter } from '@/lib/capitalize-first-latter';
import { regAgent } from '../actions/agent-actions';
import { useRouter } from 'next/navigation';

const AgentApplyForm = () => {
    const router = useRouter();
    const { data, isPending } = useGetAllBroker();

    const brokers = data?.success ? data.data : [];

    const {
        brokerModalOpen,
        setBrokerModalOpen,
        brokerAvatarId,
        setBrokerAvatarId,
    } = useBrokerForm();
    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onChange',
        resolver: zodResolver(agentApplyFormSchema),
        defaultValues: {
            broker: '',
            broker_role: 'agent',
            license: '',
            email: '',
            phone: '',
            website: '',
            bio: '',
        },
    });

    const onSubmit = async (values: agentApplyFormInput) => {
        const newAgent = await regAgent(values);

        if (!newAgent.success) {
            toast.add({
                type: 'error',
                description: newAgent.error.message,
            });
            return;
        }

        router.push('/agent-profile');
        router.refresh();
    };

    const CloseHandler = async (open: boolean) => {
        setBrokerModalOpen(open);

        if (open || !brokerAvatarId) return;

        try {
            await deleteImageKitFile(brokerAvatarId);
            setBrokerAvatarId(null);
        } catch {
            toast.add({
                type: 'error',
                description: 'Could not remove image',
            });
        }
    };

    return (
        <>
            <form
                className="mt-2 flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-2">
                    <Label htmlFor="broker" className="sr-only">
                        Agency name
                    </Label>
                    <div className="flex flex-col items-start gap-0.5">
                        <Controller
                            control={control}
                            name="broker"
                            render={({ field }) => (
                                <Select
                                    value={field.value ?? ''}
                                    onValueChange={field.onChange}
                                    disabled={isPending}
                                    items={brokers?.map((t) => ({
                                        value: t.id,
                                        label: capitalizeFirstLetter(t.name),
                                    }))}
                                >
                                    <SelectTrigger
                                        id="property_type"
                                        className="w-full h-10"
                                        aria-invalid={
                                            errors.broker ? true : false
                                        }
                                    >
                                        <SelectValue placeholder="Select your associate broker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {brokers && brokers.length > 0 ? (
                                                <SelectGroup>
                                                    {brokers.map((t) => (
                                                        <SelectItem
                                                            key={t.id}
                                                            value={t.id}
                                                        >
                                                            {capitalizeFirstLetter(
                                                                t.name,
                                                            )}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            ) : (
                                                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                                                    No brokers found.
                                                </div>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        <Button
                            type="button"
                            variant="link"
                            className="p-0"
                            size="sm"
                            onClick={() => setBrokerModalOpen(true)}
                        >
                            Can&apos;t find your agency? Add it here
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="broker_role" className="sr-only">
                        Agency role
                    </Label>
                    <Controller
                        name="broker_role"
                        control={control}
                        render={({ field }) => (
                            <Select
                                items={brokerRoles}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                    id="broker_role"
                                    aria-invalid={
                                        errors.broker_role ? true : false
                                    }
                                    className="w-full h-10"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent align="start">
                                    <SelectGroup>
                                        {brokerRoles.map((item) => (
                                            <SelectItem
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="license" className="sr-only">
                        License
                    </Label>
                    <Input
                        placeholder="License number"
                        id="license"
                        {...register('license')}
                        aria-invalid={errors.license ? true : false}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="sr-only">
                        Email
                    </Label>
                    <Input
                        type="email"
                        placeholder="Email"
                        id="email"
                        {...register('email')}
                        aria-invalid={errors.email ? true : false}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="phone" className="sr-only">
                        Phone
                    </Label>
                    <Input
                        type="tel"
                        placeholder="Phone number"
                        id="phone"
                        {...register('phone')}
                        aria-invalid={errors.phone ? true : false}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="website" className="sr-only">
                        Website
                    </Label>
                    <Input
                        placeholder="Website (optional)"
                        id="website"
                        {...register('website')}
                        aria-invalid={errors.website ? true : false}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="bio" className="sr-only">
                        Bio
                    </Label>
                    <Textarea
                        placeholder="Bio (optional)"
                        id="bio"
                        {...register('bio')}
                        aria-invalid={errors.bio ? true : false}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting} className="h-10">
                    {isSubmitting && <Loader className="animate-spin" />}
                    Submit application
                </Button>
            </form>
            <BrokerModal
                open={brokerModalOpen}
                setBrokerAvatarId={setBrokerAvatarId}
                onOpenChange={CloseHandler}
                onBrokerCreated={(id) => {
                    setValue('broker', id, {
                        shouldValidate: true,
                        shouldDirty: true,
                    });
                }}
            />
        </>
    );
};

export default AgentApplyForm;
