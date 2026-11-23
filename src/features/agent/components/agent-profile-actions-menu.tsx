'use client';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UpdateModal from '@/features/profile/components/modals/update-modal';
import { Ellipsis, Pen, TriangleAlert, UserCog } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import AgentInfoUpdateForm from './forms/agent-info-update-form';
import { deleteImageKitFile } from '@/features/dropzone/services/image-kit-delete-file';
import { toast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import { deleteAgent } from '../actions/agent-actions';

interface AgentProfileActionMenuProps {
    brokerRole: 'owner' | 'agent';
    agentId: string;
    image: string | undefined | null;
    imageId: string | undefined | null;
    name: string;
    bio: string | null;
    phone: string;
    website: string | undefined;
    email: string;
}

const AgentProfileActionMenu = ({
    agentId,
    image,
    brokerRole,
    imageId,
    bio,
    email,
    phone,
    website,
    name,
}: AgentProfileActionMenuProps) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [avatarId, setAvatarId] = useState(imageId ?? '');

    const handleDelete = async () => {
        const result = await deleteAgent({ id: agentId });

        if (!result.success) {
            toast.add({ type: 'error', description: result.error.message });
        }

        setOpenDelete(false);
        router.refresh();
    };

    const handleCloseEdit = async (nextOpen: boolean) => {
        setOpenEdit(nextOpen);
        if (nextOpen) return;

        const savedId = imageId ?? '';

        if (avatarId && avatarId !== savedId) {
            try {
                await deleteImageKitFile(avatarId);
            } catch {
                toast.add({
                    type: 'error',
                    description: 'Could not remove image',
                });
            }
        }

        setAvatarId(savedId);
    };
    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger
                    render={<Button size="icon" />}
                    className="absolute top-3 right-3"
                >
                    <Ellipsis />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-fit">
                    <DropdownMenuItem
                        className="flex gap-2 items-center cursor-pointer"
                        onClick={() => {
                            setOpenEdit(true);
                            setOpen(false);
                        }}
                    >
                        <Pen /> Edit
                    </DropdownMenuItem>
                    {brokerRole === 'owner' && (
                        <DropdownMenuItem
                            render={<Link href="/manage-broker" />}
                            className="flex gap-2 items-center cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            <UserCog className="size-4" />
                            Manage agency
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        className="flex gap-2 items-center cursor-pointer text-destructive"
                        onClick={() => {
                            setOpenDelete(true);
                            setOpen(false);
                        }}
                    >
                        <TriangleAlert /> Delete profile
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UpdateModal
                title=" Edit agent profile"
                description="Update your contact details, license, and bio. Changes
                        appear on your public profile right away."
                onOpenChange={handleCloseEdit}
                open={openEdit}
            >
                <AgentInfoUpdateForm
                    agentId={agentId}
                    avatarFileid={imageId}
                    avatarUrl={image}
                    bio={bio}
                    email={email}
                    name={name}
                    phone={phone}
                    website={website}
                    setOpen={setOpenEdit}
                    setAvatarId={setAvatarId}
                />
            </UpdateModal>
            <UpdateModal
                description="Your agent account and all associated data will be
                    permanently deleted. This action cannot be undone."
                title="Are you sure?"
                onOpenChange={setOpenDelete}
                open={openDelete}
            >
                <div className="flex items-center gap-3 w-full">
                    <Button
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={() => setOpenDelete(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        size="lg"
                        className="flex-1"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </UpdateModal>
        </>
    );
};

export default AgentProfileActionMenu;
