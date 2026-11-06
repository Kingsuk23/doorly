import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
    applyAgentImageSchema,
    ApplyAgentImageInput,
    AgentFormValues,
} from '../schemas/agentApplySchema';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getFileKey } from '@/lib/uploadthing/utils';
import { deleteUpload } from '@/components/uploadthing/actions/deleteUpload';
import { ArrowLeft, PenIcon, Trash } from 'lucide-react';
import UploadButton from '@/components/uploadthing/UploadButton';
import Dropzone from '@/components/uploadthing/Dropzone';
import { useAddAgent } from '../queries/agentQueries';
import { useRouter } from 'next/navigation';

interface AgentProfileImageProps {
    onBack: (data?: Partial<ApplyAgentImageInput>) => void;
    values: AgentFormValues;
    reset: () => void;
}

const AgentProfileImage: React.FC<AgentProfileImageProps> = ({
    onBack,
    values,
    reset,
}) => {
    const { mutate, isPending } = useAddAgent();
    const route = useRouter();

    const {
        handleSubmit,
        control,
        formState: { isValid },
        getValues,
    } = useForm({
        resolver: zodResolver(applyAgentImageSchema),
        mode: 'onChange',
    });

    const onSubmit = (data: ApplyAgentImageInput) => {
        const payload: AgentFormValues = {
            ...values,
            imageUrl: data.imageUrl,
        };
        mutate(payload, {
            onSuccess: () => {
                reset();
                route.push('/profile');
            },
        });
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="logoUrl" className="sr-only">
                    Logo
                </Label>
                <Controller
                    control={control}
                    name="imageUrl"
                    render={({ field }) =>
                        field.value ? (
                            <div className="flex items-center flex-col gap-3">
                                <Image
                                    src={field.value}
                                    alt="agency logo"
                                    width={120}
                                    height={120}
                                    className="size-30 rounded-full border object-cover"
                                />

                                <div className="flex items-center justify-center gap-4 w-full">
                                    <Button
                                        type="button"
                                        onClick={async () => {
                                            const url = field.value as string;
                                            const key = getFileKey(url);
                                            field.onChange('');
                                            await deleteUpload(key);
                                        }}
                                        variant="destructive"
                                    >
                                        <Trash /> Remove
                                    </Button>
                                    <UploadButton
                                        variant="outline"
                                        perviousUrl={field.value}
                                        onUpload={field.onChange}
                                    >
                                        <PenIcon /> Change
                                    </UploadButton>
                                </div>
                            </div>
                        ) : (
                            <Dropzone onUpload={field.onChange} />
                        )
                    }
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
                    disabled={!isValid || isPending}
                    size="lg"
                    className="flex-1"
                >
                    {isPending ? 'saving' : 'Submit'}
                </Button>
            </div>
        </form>
    );
};

export default AgentProfileImage;
