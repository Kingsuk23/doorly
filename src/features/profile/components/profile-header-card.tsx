import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/get-initials';
import { BadgeCheck, CalendarDays, Mail, Plus } from 'lucide-react';
import { Stat } from '../types';
import ProfileStats from './profile-stats';

interface ProfileHeaderCardProps {
    memberSince: string;
    email: string;
    emailVerified: boolean;
    name: string;
    image: string | null | undefined;
    stats: Stat[];
}

const ProfileHeaderCard = ({
    email,
    emailVerified,
    memberSince,
    name,
    image,
    stats,
}: ProfileHeaderCardProps) => {
    return (
        <div className="relative mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className=" h-20 bg-linear-to-r from-blue-500/20 via-indigo-500/15 to-transparent" />

            <div className="px-6 pb-6">
                <div className="-mt-6.5 flex items-center justify-between gap-4">
                    <Avatar className="size-14 ring-4 ring-card shadow-md">
                        <AvatarImage src={image ?? undefined} alt={name} />
                        <AvatarFallback className="text-xl">
                            {getInitials(name)}
                        </AvatarFallback>
                    </Avatar>

                    <Button>
                        <Plus className="size-4" />
                        <span className="hidden sm:inline">Add property</span>
                    </Button>
                </div>

                <div className="mt-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-semibold tracking-tight">
                            {name}
                        </h3>
                        {emailVerified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                                <BadgeCheck className="size-3.5" />
                                Verified
                            </span>
                        )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {email && (
                            <span className="inline-flex items-center gap-1.5">
                                <Mail className="size-4" />
                                {email}
                            </span>
                        )}
                        {memberSince && (
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="size-4" />
                                Member since {memberSince}
                            </span>
                        )}
                    </div>
                </div>

                <ProfileStats stats={stats} />
            </div>
        </div>
    );
};

export default ProfileHeaderCard;
