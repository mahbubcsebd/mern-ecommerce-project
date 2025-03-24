const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getAllUsers() {
    const res = await fetch(`${baseUrl}/users`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch all users');
    }

    return res.json();
}

// Create User
export async function createUser(userData) {
    const res = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: userData, // userData is already a JSON string
    });

    const data = await res.json();
    return Response.json(data);
}

// Create User
export const verifyUser = async (token) => {
    try {
        if (!token) {
            throw new Error('টোকেন প্রয়োজন');
        }

        console.log('ফ্রন্টএন্ড থেকে পাঠানো টোকেন:', token);

        const res = await fetch(`${baseUrl}/users/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        const data = await res.json();
        console.log('API রেসপন্স:', data);

        if (!res.ok) {
            // API রেসপন্স থেকে এরর মেসেজ নিন
            const errorMessage = data.message || 'ভেরিফিকেশন ব্যর্থ হয়েছে';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error('ইউজার ভেরিফিকেশন এরর:', error);
        throw error; // কলিং কম্পোনেন্ট দ্বারা হ্যান্ডলিং-এর জন্য এরর থ্রো করুন
    }
};

export async function fetchUserProfile(accessToken) {
    console.log('accessToken---------------------', accessToken);

    const res = await fetch(`${baseUrl}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Error Fetching User:', res.status, errorText);
        throw new Error(`Error ${res.status}: ${errorText}`);
    }

    return res.json();
}
