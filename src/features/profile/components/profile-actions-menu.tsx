'use client';

import { Ellipsis, KeyRound, Mail, Trash2, UserPen } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UpdateModal from './modals/update-modal';
import PasswordUpdateForm from './forms/password-update-form';
import ChangeEmailForm from './forms/change-email-form';
import AccountDeleteForm from './forms/account-delete-form';
import UserInfoUpdateForm from './forms/user-info-update-form';
import { deleteImageKitFile } from '@/features/dropzone/services/image-kit-delete-file';
import { toast } from '@/components/ui/toast';

interface ProfileActionsMenuProps {
    currentImage?: string | null | undefined;
    fileId?: string | null | undefined;
    currentName: string;
}

const ProfileActionsMenu = ({
    currentName,
    currentImage,
    fileId,
}: ProfileActionsMenuProps) => {
    const [openPasswordUpdateModal, setOpenPasswordUpdateModal] =
        useState(false);
    const [openChangeEmailModal, setOpenChangeEmailModal] = useState(false);
    const [openAccountDeleteModal, setOpenAccountDeleteModal] = useState(false);
    const [openUserBasicInfoUpdateModal, setOpenUserBasicInfoUpdateModal] =
        useState(false);
    const [avatarId, setAvatarId] = useState(fileId ?? '');

    const handleCloseBasicInfoModal = async (nextOpen: boolean) => {
        setOpenUserBasicInfoUpdateModal(nextOpen);
        if (nextOpen) return;

        const savedId = fileId ?? '';

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
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={<Button size="icon" aria-label="Profile actions" />}
                    className="absolute top-2 right-2 z-20"
                >
                    <Ellipsis />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-fit">
                    <DropdownMenuItem
                        onClick={() => setOpenUserBasicInfoUpdateModal(true)}
                    >
                        <UserPen />
                        Change profile picture & name
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpenChangeEmailModal(true)}
                    >
                        <Mail />
                        Change email
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setOpenPasswordUpdateModal(true)}
                    >
                        <KeyRound />
                        Change password
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setOpenAccountDeleteModal(true)}
                    >
                        <Trash2 />
                        Delete profile
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {openPasswordUpdateModal && (
                <UpdateModal
                    description="Enter your current password and choose a new one."
                    title="Change your password"
                    onOpenChange={setOpenPasswordUpdateModal}
                    open={openPasswordUpdateModal}
                >
                    <PasswordUpdateForm
                        onClose={() => setOpenPasswordUpdateModal(false)}
                    />
                </UpdateModal>
            )}
            {openChangeEmailModal && (
                <UpdateModal
                    description="Enter the new email address you want to use for your account."
                    title="Change your email"
                    onOpenChange={setOpenChangeEmailModal}
                    open={openChangeEmailModal}
                >
                    <ChangeEmailForm
                        onClose={() => setOpenChangeEmailModal(false)}
                    />
                </UpdateModal>
            )}
            {openAccountDeleteModal && (
                <UpdateModal
                    description="This permanently deletes your account and data. This cannot be undone."
                    title="Delete your account"
                    onOpenChange={setOpenAccountDeleteModal}
                    open={openAccountDeleteModal}
                >
                    <AccountDeleteForm
                        onClose={() => setOpenAccountDeleteModal(false)}
                    />
                </UpdateModal>
            )}
            {openUserBasicInfoUpdateModal && (
                <UpdateModal
                    description="Change your name or profile picture."
                    title="Edit your profile"
                    onOpenChange={handleCloseBasicInfoModal}
                    open={openUserBasicInfoUpdateModal}
                >
                    <UserInfoUpdateForm
                        onClose={() => setOpenUserBasicInfoUpdateModal(false)}
                        currentName={currentName}
                        currentImage={currentImage}
                        fileId={fileId}
                        setAvatarId={setAvatarId}
                    />
                </UpdateModal>
            )}
        </>
    );
};

export default ProfileActionsMenu;
