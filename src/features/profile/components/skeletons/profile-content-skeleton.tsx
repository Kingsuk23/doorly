import TableSkeleton from '@/components/shared/skeleton/table-skeleton';
import ProfileHeaderCardSkeleton from './profile-header-card-skeleton';

const ProfileContentSkeleton = () => {
    return (
        <>
            <ProfileHeaderCardSkeleton />
            <TableSkeleton />
        </>
    );
};

export default ProfileContentSkeleton;
