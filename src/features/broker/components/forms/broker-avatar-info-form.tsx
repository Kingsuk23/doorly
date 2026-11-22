import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Dropzone from '@/features/dropzone/components/dropzone';
import {
    brokerAvatarInfoInput,
    brokerAvatarInfoSchema,
} from '../../schemas/broker-avatar-info-zod-schema';
import { brokerFormValues } from '../../types';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deleteImageKitFile } from '@/features/dropzone/services/image-kit-delete-file';
import { ArrowLeft, Loader, Trash } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ListABroker } from '../../actions/broker-actions';
import { toast } from '@/components/ui/toast';

interface BrokerAvatarInfoFormProps {
    defaultValues: brokerAvatarInfoInput;
    onBack: (data?: Partial<brokerFormValues>) => void;
    values: brokerFormValues;
    reset: () => void;
    onClose: (open: boolean) => void;
    setAvatarId: React.Dispatch<React.SetStateAction<string | null>>;
    onBrokerCreated: (id: string) => void;
}

const BrokerAvatarInfoForm = ({
    defaultValues,
    onBack,
    onBrokerCreated,
    onClose,
    reset,
    setAvatarId,
    values,
}: BrokerAvatarInfoFormProps) => {
    const qc = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: ListABroker,
        onSuccess: (data) => {
            if (!data.success) {
                toast.add({ type: 'error', description: data.error.message });
                return;
            }
            onBrokerCreated(data.data.id);
            onClose(false);
            reset();
            qc.invalidateQueries({ queryKey: ['fetch_all_broker'] });
        },
        onError: (data) => {
            toast.add({ type: 'error', description: data.message });
        },
    });

    const {
        handleSubmit,
        control,
        formState: { isValid, isSubmitting },
        getValues,
    } = useForm({
        resolver: zodResolver(brokerAvatarInfoSchema),
        mode: 'onChange',
        defaultValues,
    });

    const avatar = useWatch({ control, name: 'avatar' });

    const onSubmit = (data: brokerAvatarInfoInput) => {
        const payload: brokerFormValues = {
            ...values,
            ...data,
        };
        mutate(payload);
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="avatar" className="sr-only">
                    Avatar
                </Label>

                <Controller
                    control={control}
                    name="avatar"
                    render={({ field }) => {
                        return (
                            <div className="flex items-center gap-4">
                                {avatar.url && (
                                    <Avatar className="size-16">
                                        <AvatarImage
                                            src={avatar.url ?? undefined}
                                        />
                                    </Avatar>
                                )}

                                <div className="flex flex-1 flex-col gap-2">
                                    <Dropzone
                                        label="avatar"
                                        folder="/doorly/avatar/broker"
                                        onUploaded={(media) => {
                                            field.onChange({
                                                url: media.url,
                                                fileId: media.fileId,
                                            });
                                            setAvatarId(media.fileId);
                                        }}
                                        fileId={avatar.fileId ?? undefined}
                                    />

                                    {avatar.url && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={async () => {
                                                try {
                                                    if (avatar.fileId)
                                                        await deleteImageKitFile(
                                                            avatar.fileId,
                                                        );
                                                    field.onChange({
                                                        url: '',
                                                        fileId: '',
                                                    });
                                                    setAvatarId('');
                                                } catch {
                                                    toast.add({
                                                        type: 'error',
                                                        description:
                                                            'Could not remove image',
                                                    });
                                                }
                                            }}
                                        >
                                            <Trash /> Remove
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    }}
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
                    disabled={!isValid || isSubmitting || isPending}
                    size="lg"
                    className="flex-1"
                >
                    {(isSubmitting || isPending) && (
                        <Loader className="animate-spin" />
                    )}
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default BrokerAvatarInfoForm;
