import { Skeleton } from '@/components/ui/skeleton';
import ProfileStateSkeleton from './profile-stats-skeleton';

const ProfileHeaderCardSkeleton = () => {
    return (
        <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm">
            <Skeleton className="h-20" />

            <div className="px-6 pb-6">
                <div className="-mt-5 flex items-end justify-between gap-4">
                    <Skeleton className="size-13 rounded-full" />
                    <div className="flex gap-2 items-center">
                        <Skeleton className="h-7 w-24" />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-22" />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-28" />
                </div>
                <ProfileStateSkeleton />
            </div>
        </div>
    );
};

export default ProfileHeaderCardSkeleton;
