'use clint';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from 'cn';
import { Loader } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import {
    agentInfoUpdateFormInput,
    agentInfoUpdateFormSchema,
} from '../../schema/agent-zod-schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/get-initials';
import Dropzone from '@/features/dropzone/components/dropzone';
import { toast } from '@/components/ui/toast';
import { updateAgentInfo } from '../../actions/agent-actions';
import { useRouter } from 'next/navigation';

interface AgentInfoUpdateFormProps {
    className?: string;
    email: string;
    phone: string;
    bio: string | null;
    website: string | undefined;
    avatarUrl: string | null | undefined;
    avatarFileid: string | undefined | null;
    name: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    agentId: string;
    setAvatarId: React.Dispatch<React.SetStateAction<string>>;
}

const AgentInfoUpdateForm = ({
    bio,
    email,
    phone,
    setOpen,
    website,
    className,
    avatarFileid,
    avatarUrl,
    name,
    setAvatarId,
    agentId,
}: AgentInfoUpdateFormProps) => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        resolver: zodResolver(agentInfoUpdateFormSchema),
        mode: 'onChange',
        defaultValues: {
            avatar: {
                fileId: '',
                url: '',
            },
            bio: '',
            email: '',
            phone: '',
            website: '',
            name: '',
        },
        values: {
            email: email ?? '',
            avatar: { fileId: avatarFileid ?? '', url: avatarUrl ?? '' },
            bio: bio ?? '',
            phone: phone ?? '',
            name: name ?? '',
            website: website ?? '',
        },
    });

    const onSubmit = async (data: agentInfoUpdateFormInput) => {
        const result = await updateAgentInfo({ body: data, id: agentId });

        if (!result.success) {
            toast.add({ type: 'error', description: result.error.message });
            return;
        }

        router.refresh();
        setOpen(false);
    };

    return (
        <form
            className={cn('mt-2 flex flex-col gap-4', className)}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="logoUrl" className="sr-only">
                    Logo
                </Label>
                <Controller
                    control={control}
                    name="avatar"
                    render={({ field }) => {
                        const shownUrl =
                            field.value === undefined
                                ? avatarUrl
                                : field.value?.url;

                        return (
                            <div className="flex items-center gap-4">
                                <Avatar className="size-16">
                                    <AvatarImage
                                        src={shownUrl ?? undefined}
                                        alt={name}
                                    />
                                    <AvatarFallback>
                                        {getInitials(name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-1 flex-col gap-2">
                                    <Dropzone
                                        label="avatar"
                                        folder="/doorly/avatar/profile"
                                        fileId={avatarFileid ?? undefined}
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
                <Input
                    placeholder="Name"
                    id="name"
                    className="rounded-md border bg-transparent p-3 text-sm"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    {...register('name')}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="bio" className="sr-only">
                    Bio (optional)
                </Label>
                <Textarea
                    placeholder="Bio (optional)"
                    id="bio"
                    className="rounded-md border bg-transparent p-3 h-10 text-sm"
                    aria-invalid={errors.bio ? 'true' : 'false'}
                    {...register('bio')}
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
                {isSubmitting && <Loader className="animate-spin" />}
                Update profile
            </Button>
        </form>
    );
};

export default AgentInfoUpdateForm;
