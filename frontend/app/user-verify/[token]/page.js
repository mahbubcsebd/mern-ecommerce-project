'use client'; // Ensure this runs on the client side

import { verifyUser } from '@/utils/users';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const VerifyPage = ({ params }) => {
     const { token } = useParams();
    const router = useRouter();
    const [message, setMessage] = useState('Verifying...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleVerify = async () => {
            try {
                const response = await verifyUser(token);

                if (response.success) {
                    setMessage('Verification successful! Redirecting...');
                    setTimeout(() => router.push('/login'), 2000); // Redirect after 2s
                } else {
                    setMessage(response.message || 'Verification failed.');
                }
            } catch (error) {
                setMessage(error.message || 'Verification failed.');
            } finally {
                setLoading(false);
            }
        };

        if (token) handleVerify();
    }, [token, router]);

    return (
        <div className="flex justify-center items-center h-screen">
            {loading ? <p>Loading...</p> : <p>{message}</p>}
        </div>
    );
};

export default VerifyPage;
