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

const ProfileActionsMenu = () => {
    const [openPasswordUpdateModal, setOpenPasswordUpdateModal] =
        useState(false);
    const [openChangeEmailModal, setOpenChangeEmailModal] = useState(false);

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
                    <DropdownMenuItem>
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

                    <DropdownMenuItem variant="destructive">
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
        </>
    );
};

export default ProfileActionsMenu;
