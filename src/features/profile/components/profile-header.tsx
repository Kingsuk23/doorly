'use client';

import { Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';

import { createPropertyDraft } from '@/features/properties/actions/property-actions';
import { toast } from '@/components/ui/toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/get-initials';
interface ProfileHeaderCardProps {
    name: string;
    image?: string | null | undefined;
}

const ProfileHeader = ({ name, image }: ProfileHeaderCardProps) => {
    const router = useRouter();

    const handleCreateProperty = async () => {
        const res = await createPropertyDraft();
        if (!res.success) {
            toast.add({ type: 'error', description: res.error.message });
            return;
        }

        router.push(`/properties/new/${res.data.id}/edit?step=location_c`);
    };

    return (
        <div className="-mt-6.5 flex items-center justify-between gap-4">
            <Avatar className="size-14 ring-4 ring-card shadow-md">
                <AvatarImage src={image ?? undefined} alt={name} />
                <AvatarFallback className="text-xl">
                    {getInitials(name)}
                </AvatarFallback>
            </Avatar>

            <Button onClick={handleCreateProperty}>
                <Plus className="size-4" />
                <span className="hidden sm:inline">Add property</span>
            </Button>
        </div>
    );
};

export default ProfileHeader;
