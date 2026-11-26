import {
    BadgeCheck,
    CalendarDays,
    Globe,
    Hotel,
    Mail,
    Phone,
} from 'lucide-react';
import { capitalizeFirstLetter } from '@/lib/capitalize-first-latter';
import { dateFormatter } from '@/lib/date-formatter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/get-initials';
import InfoRow from './info-row';
import AgentProfileActionMenu from './agent-profile-actions-menu';
import AgentInboxModal from './agent-inbox-modal';

interface AgentProfileCardProps {
    rawName: string;
    createdAt: Date;
    avatar: string | undefined | null;
    role: 'owner' | 'agent';
    isVerified: boolean;
    bio: string | null;
    email: string;
    phone: string;
    website: string | undefined;
    license: string;
    brokerName: string;
    agentId: string;
    avatarId: string | undefined | null;
    id: string | undefined;
}

const AgentProfileCard = ({
    createdAt,
    rawName,
    avatar,
    role,
    isVerified,
    bio,
    email,
    license,
    phone,
    website,
    brokerName,
    agentId,
    avatarId,
    id,
}: AgentProfileCardProps) => {
    const name = capitalizeFirstLetter(rawName);

    const memberSince = dateFormatter.format(createdAt);
    return (
        <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm relative">
            <div className="h-20 bg-linear-to-r from-blue-500/20 via-indigo-500/15 to-transparent" />
            <AgentProfileActionMenu
                agentId={agentId}
                bio={bio}
                brokerRole={role}
                email={email}
                image={avatar}
                imageId={avatarId}
                name={rawName}
                phone={phone}
                website={website}
            />
            <div className="px-6 pb-6">
                <div className="-mt-5.5 flex items-end justify-between gap-4">
                    <Avatar className="size-14 ring-4 ring-card shadow-md">
                        <AvatarImage src={avatar ?? undefined} alt={name} />
                        <AvatarFallback className="text-xl">
                            {getInitials(rawName)}
                        </AvatarFallback>
                    </Avatar>
                    <AgentInboxModal userId={id} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold tracking-tight">
                        {name}
                    </h3>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {capitalizeFirstLetter(role)}
                    </span>
                    {isVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                            <BadgeCheck className="size-3.5" />
                            Verified
                        </span>
                    )}
                </div>

                {bio && (
                    <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                        {bio}
                    </p>
                )}

                <div className="mt-5 grid gap-3 border-t pt-5 sm:grid-cols-2">
                    <InfoRow icon={Mail} label="Email" value={email} />
                    <InfoRow icon={Phone} label="Phone" value={phone} />
                    <InfoRow
                        icon={BadgeCheck}
                        label="License"
                        value={license}
                    />
                    {website && (
                        <InfoRow
                            icon={Globe}
                            label="Website"
                            value={website}
                            href={website}
                        />
                    )}
                    <InfoRow
                        icon={CalendarDays}
                        label="Member since"
                        value={`${memberSince}`}
                    />
                    <InfoRow icon={Hotel} label="Broker" value={brokerName} />
                </div>
            </div>
        </div>
    );
};

export default AgentProfileCard;
