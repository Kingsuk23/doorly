import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileHeaderCard from './profile-header-card';

const ProfileContent = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) redirect('/');

    const { name, email, image, emailVerified, createdAt } = session.user;
    const stats = [
        { label: 'Properties', value: 0 },
        { label: 'Listed', value: 0 },
        { label: 'Agent requests', value: 0 },
    ];

    return (
        <>
            <ProfileHeaderCard
                name={name}
                email={email}
                emailVerified={emailVerified}
                image={image}
                memberSince={new Intl.DateTimeFormat('en-US', {
                    month: 'long',
                    year: 'numeric',
                }).format(createdAt)}
                stats={stats}
            />
        </>
    );
};

export default ProfileContent;
