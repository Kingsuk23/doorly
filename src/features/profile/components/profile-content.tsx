import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
    getPropertiesByUser,
    getPropertyCount,
} from '@/features/properties/actions/property-actions';
import { toast } from '@/components/ui/toast';
import ProfileActionsMenu from './profile-actions-menu';
import { BadgeCheck, CalendarDays, Mail } from 'lucide-react';
import ProfileStats from './profile-stats';
import ProfileHeader from './profile-header';
import PropertiesDataTable from './table/properties-data-table';
import { propertiesColumns } from './table/properties-columns';
import { dateFormatter } from '@/lib/date-formatter';

const ProfileContent = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect('/');

    const { name, email, image, emailVerified, createdAt, imageId } =
        session.user;

    const [countResult, propertiesResult] = await Promise.all([
        getPropertyCount(),
        getPropertiesByUser(),
    ]);

    if (!countResult?.success) {
        toast.add({ type: 'error', description: countResult.error.message });
        return;
    }

    if (!propertiesResult?.success) {
        toast.add({
            type: 'error',
            description: propertiesResult.error.message,
        });
        return;
    }

    const memberSince = dateFormatter.format(createdAt);

    const stats = [
        { label: 'Properties', value: countResult?.data },
        { label: 'Listed', value: 0 },
        { label: 'Agent requests', value: 0 },
    ];

    return (
        <>
            <div className="relative mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className=" h-20 bg-linear-to-r from-blue-500/20 via-indigo-500/15 to-transparent" />

                <ProfileActionsMenu
                    currentName={name}
                    currentImage={image}
                    fileId={imageId}
                />

                <div className="px-6 pb-6">
                    <ProfileHeader name={name} image={image} />

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
            <PropertiesDataTable
                columns={propertiesColumns}
                data={propertiesResult.data}
            />
        </>
    );
};

export default ProfileContent;
