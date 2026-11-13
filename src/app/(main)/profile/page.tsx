import { Suspense } from 'react';

import ProfileContent from '@/features/profile/components/profile-content';
import ProfileContentSkeleton from '@/features/profile/components/skeletons/profile-content-skeleton';

const Profile = () => {
    return (
        <main className="max-w-7xl mx-auto md:px-4 px-2 flex flex-col justify-between">
            <Suspense fallback={<ProfileContentSkeleton />}>
                <ProfileContent />
            </Suspense>
        </main>
    );
};

export default Profile;
