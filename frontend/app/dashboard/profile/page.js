// import { fetchUserProfile } from '@/utils/users';
import { fetchUserProfile } from '@/utils/users';
import { cookies } from 'next/headers';

export default async function ProfilePage() {
    // Use the cookies() function instead of headers().get('cookie')
   const cookieStore = await cookies();
   const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return <div>Please log in.</div>;
    }

    try {
        const userData = await fetchUserProfile(accessToken);

        return (
            <div>
                <h1>Welcome, {userData?.payload?.user?.firstName}</h1>
                <p>Email: {userData?.payload?.user?.email}</p>
                <p>Role: {userData?.payload?.user?.role}</p>
            </div>
        );
    } catch (error) {
        console.error(error);
        return <div>Error loading profile</div>;
    }
}
