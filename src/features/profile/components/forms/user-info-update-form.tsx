import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Dropzone from '@/features/dropzone/components/dropzone';
import { Input } from '@/components/ui/input';
import {
    userBasicInfoInput,
    userBasicInfoSchema,
} from '../../schema/profile-zod-schemas';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/get-initials';

interface UserInfoUpdateFormProps {
    onClose: () => void;
    currentImage?: string | null | undefined;
    currentName: string;
    fileId?: string | null | undefined;
    setAvatarId: React.Dispatch<React.SetStateAction<string>>;
}

const UserInfoUpdateForm = ({
    onClose,
    currentName,
    currentImage = '',
    fileId,
    setAvatarId,
}: UserInfoUpdateFormProps) => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(userBasicInfoSchema),
        defaultValues: {
            avatar: {
                url: currentImage ?? '',
                fileId: fileId ?? '',
            },
            name: currentName,
        },
    });

    const onSubmit = async (data: userBasicInfoInput) => {
        const { error } = await authClient.updateUser({
            name: data.name,
            ...(data.avatar !== undefined && {
                image: data.avatar?.url ?? null,
                imageId: data.avatar?.fileId ?? null,
            }),
        });

        if (error) {
            setError('root', {
                message: error.message ?? 'Could not update your profile',
            });
            return;
        }

        toast.add({ type: 'success', description: 'Profile updated' });
        router.refresh();
        onClose();
    };
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-2"
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="avatar" className="sr-only">
                    Avatar
                </Label>

                <Controller
                    control={control}
                    name="avatar"
                    render={({ field }) => {
                        const shownUrl =
                            field.value === undefined
                                ? currentImage
                                : field.value?.url;

                        return (
                            <div className="flex items-center gap-4">
                                <Avatar className="size-16">
                                    <AvatarImage
                                        src={shownUrl ?? undefined}
                                        alt={currentName}
                                    />
                                    <AvatarFallback>
                                        {getInitials(currentName)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-1 flex-col gap-2">
                                    <Dropzone
                                        label="avatar"
                                        folder="/doorly/avatar/profile"
                                        onUploaded={(media) => {
                                            field.onChange({
                                                url: media.url,
                                                fileId: media.fileId,
                                            });
                                            setAvatarId(media.fileId);
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    }}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="sr-only">
                    Name
                </Label>

                <Input id="name" placeholder="Name" {...register('name')} />
            </div>

            {errors.root && (
                <div className="bg-destructive/10 rounded-md h-8 flex items-center text-destructive px-2">
                    {errors.root.message}
                </div>
            )}

            <Button
                type="submit"
                className="w-full h-10"
                size="lg"
                disabled={isSubmitting}
            >
                Update profile
            </Button>
        </form>
    );
};

export default UserInfoUpdateForm;
