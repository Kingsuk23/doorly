'use client';

import FieldRow from '@/components/shared/field-row';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import Dropzone from '@/features/dropzone/components/dropzone';
import { deleteImageKitFile } from '@/features/dropzone/services/image-kit-delete-file';
import FormSkeleton from '@/features/properties/components/skeleton/form-skeleton';
import {
    useGetListingById,
    useGetListingMedia,
} from '../../queries/listing-queries';
import {
    mediaFormSchema,
    type mediaFormInput,
} from '../../schemas/zod-listings-schema';
import { file, z } from 'zod';

type MediaFormInput = z.input<typeof mediaFormSchema>;
type MediaFormOutput = z.output<typeof mediaFormSchema>;

const ROOM_TYPES = [
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'bathroom', label: 'Bathroom' },
    { value: 'exterior', label: 'Exterior' },
];

const MEDIA_TYPES = [
    { value: 'photo', label: 'Photo' },
    { value: 'video', label: 'Video' },
    { value: 'virtual_tour', label: 'Virtual tour' },
    { value: 'floor_plan', label: 'Floor plan' },
    { value: 'drone', label: 'Drone' },
];

interface ListingMediaFormProps {
    formId: string;
    listingId: string;
    onSubmit: (values: mediaFormInput) => void;
}

const ListingMediaForm = ({
    formId,
    listingId,
    onSubmit,
}: ListingMediaFormProps) => {
    const { data, isPending } = useGetListingMedia(listingId);

    const items = useMemo(
        () =>
            (data?.success ? data.data : []).map((m) => ({
                id: m.id,
                title: m.title,
                roomType: m.roomType,
                mediaType: m.mediaType,
                isPrimary: m.isPrimary,
                url: m.url,
                thumbnailUrl: m.thumbnailUrl,
                width: m.width,
                height: m.height,
                fileSize: m.fileSize,
                mimeType: m.mimeType ?? undefined,
                fileId: m.fileId,
            })),
        [data],
    );

    const {
        control,
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<MediaFormInput, unknown, MediaFormOutput>({
        resolver: zodResolver(mediaFormSchema),
        defaultValues: { items: [] },
        values: { items },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    useEffect(() => {
        if (data && !data.success) {
            toast.add({ type: 'error', description: data.error.message });
        }
    }, [data]);

    // Only one cover image allowed
    const setCover = (index: number) => {
        getValues('items').forEach((_, i) =>
            setValue(`items.${i}.isPrimary`, i === index),
        );
    };

    const handleRemove = async (index: number) => {
        const fileId = getValues(`items.${index}.fileId`);
        remove(index);
        if (fileId) await deleteImageKitFile(fileId);
    };

    if (isPending) return <FormSkeleton />;

    return (
        <form
            className="flex flex-col gap-6"
            id={formId}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Dropzone
                label="media"
                folder={`/doorly/listings/${listingId}`}
                multiple
                accept={{ 'image/*': [], 'video/*': [] }}
                hint="Drag photos or videos here or"
                onUploaded={(m, file) =>
                    append({
                        title: file.name.replace(/\.[^.]+$/, ''),
                        roomType: 'exterior',
                        mediaType: file.type.startsWith('video/')
                            ? 'video'
                            : 'photo',
                        isPrimary: false,
                        url: m.url,
                        thumbnailUrl: m.thumbnailUrl,
                        width: m.width,
                        height: m.height,
                        fileSize: m.size,
                        mimeType: file.type,
                        fileId: m.fileId,
                    })
                }
            />

            {errors.items?.message && (
                <p className="text-sm text-destructive">
                    {errors.items.message}
                </p>
            )}

            {fields.map((field, index) => {
                const isVideo = field.mimeType?.startsWith('video/');
                return (
                    <div
                        key={field.id}
                        className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row"
                    >
                        {isVideo ? (
                            <video
                                src={field.url}
                                poster={field.thumbnailUrl}
                                controls
                                preload="metadata"
                                playsInline
                                className="h-30 w-40 rounded-md bg-black object-cover"
                            />
                        ) : (
                            <Image
                                src={field.thumbnailUrl}
                                alt={field.title}
                                width={160}
                                height={120}
                                className="h-30 w-40 rounded-md object-cover"
                            />
                        )}
                        <div className="flex flex-1 flex-col gap-3">
                            <FieldRow
                                label="Title"
                                htmlFor={`title-${index}`}
                                hint="A short caption, e.g. “Modern kitchen with island”."
                            >
                                <Input
                                    id={`title-${index}`}
                                    {...register(`items.${index}.title`)}
                                    aria-invalid={
                                        !!errors.items?.[index]?.title
                                    }
                                />
                            </FieldRow>

                            <FieldRow
                                label="Room"
                                htmlFor={`room-${index}`}
                                hint="Which part of the property this shows."
                            >
                                <Controller
                                    name={`items.${index}.roomType`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ?? ''}
                                            onValueChange={field.onChange}
                                            items={ROOM_TYPES}
                                        >
                                            <SelectTrigger
                                                id={`room-${index}`}
                                                className="w-full h-10"
                                            >
                                                <SelectValue placeholder="Select room" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {ROOM_TYPES.map((item) => (
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
                            </FieldRow>

                            <FieldRow
                                label="Media type"
                                htmlFor={`type-${index}`}
                                hint="Change only for floor plans, virtual tours or drone shots."
                            >
                                <Controller
                                    name={`items.${index}.mediaType`}
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ?? ''}
                                            onValueChange={field.onChange}
                                            items={MEDIA_TYPES}
                                        >
                                            <SelectTrigger
                                                id={`type-${index}`}
                                                className="w-full h-10"
                                            >
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {MEDIA_TYPES.map((item) => (
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
                            </FieldRow>

                            <div className="flex items-center justify-between">
                                <Controller
                                    name={`items.${index}.isPrimary`}
                                    control={control}
                                    render={({ field }) => (
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="cover"
                                                checked={!!field.value}
                                                onChange={() => setCover(index)}
                                            />
                                            Use as cover
                                        </label>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemove(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </form>
    );
};

export default ListingMediaForm;
