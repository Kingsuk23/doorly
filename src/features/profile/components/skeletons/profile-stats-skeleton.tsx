import { Skeleton } from '@/components/ui/skeleton';

const ProfileStateSkeleton = () => {
    return (
        <Skeleton className="mt-6 grid grid-cols-3 divide-x rounded-xl border bg-muted/30 items-center h-20" />
    );
};

export default ProfileStateSkeleton;
