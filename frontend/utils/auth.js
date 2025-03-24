const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(loginData) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include', // কুকিজ পাঠানোর জন্য
                body: JSON.stringify(loginData),
            }
        );

        const data = await res.json();
        if (!res.ok) {
            return {
                success: false,
                message: data.message || 'There was a login error',
            };
        }

        // লগইন সফল হলে, সার্ভার ইউজারের ডিটেইলস (পাসওয়ার্ড ছাড়া) response এ পাঠাবে
        return { success: true, ...data };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Server error',
        };
    }
}


// Logout User
export async function logout() {
    try {
        const res = await fetch(`${baseUrl}/auth/logout`, {
            method: 'POST', // Always use POST for logout
            credentials: 'include', // Necessary for clearing cookies
        });

        if (!res.ok) {
            return {
                success: false,
                message: 'There was a logout error',
            };
        }

        // Clear user from local storage (if stored)
        localStorage.removeItem('user');

        return {
            success: true,
            message: 'logout successful',
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Server error',
        };
    }
}
