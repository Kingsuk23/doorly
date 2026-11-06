import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, PenIcon, Trash } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import {
    AgencyFormValues,
    agencyProfileImageInput,
    agencyProfileImageSchema,
} from '../schemas/agencySchema';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Dropzone from '@/components/uploadthing/Dropzone';
import UploadButton from '@/components/uploadthing/UploadButton';
import { getFileKey } from '@/lib/uploadthing/utils';
import { useAddAgency } from '../queries/agencyQueries';
import { deleteUpload } from '@/components/uploadthing/actions/deleteUpload';

interface agencyAddressFormProps {
    defaultValues: agencyProfileImageInput;
    back: (data?: Partial<AgencyFormValues>) => void;
    values: AgencyFormValues;
    reset: () => void;
    onClose: (open: boolean) => void;
    setImageUrlAgency: React.Dispatch<React.SetStateAction<string | null>>;
    onAgencyCreated: (id: string) => void;
}

const AgencyProfileImage: React.FC<agencyAddressFormProps> = ({
    back,
    defaultValues,
    values,
    reset,
    onClose,
    setImageUrlAgency,
    onAgencyCreated,
}) => {
    const { mutate, isPending } = useAddAgency((id) => {
        onAgencyCreated(id);
        onClose(false);
        reset();
    });

    const {
        handleSubmit,
        control,
        formState: { isValid },
        getValues,
    } = useForm({
        resolver: zodResolver(agencyProfileImageSchema),
        mode: 'onChange',
        defaultValues,
    });

    const onSubmit = (data: agencyProfileImageInput) => {
        const payload: AgencyFormValues = {
            ...values,
            logoUrl: data.logoUrl,
        };

        mutate(payload);
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="logoUrl" className="sr-only">
                    Logo
                </Label>
                <Controller
                    control={control}
                    name="logoUrl"
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
                                        onUpload={(url: string) => {
                                            setImageUrlAgency(url);
                                            field.onChange(url);
                                        }}
                                    >
                                        <PenIcon /> Change
                                    </UploadButton>
                                </div>
                            </div>
                        ) : (
                            <Dropzone
                                onUpload={(url: string) => {
                                    setImageUrlAgency(url);
                                    field.onChange(url);
                                }}
                            />
                        )
                    }
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

export default AgencyProfileImage;
