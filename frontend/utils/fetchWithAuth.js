// utils/fetchWithAuth.js
export async function fetchWithAuth(url, options = {}) {
    // প্রথমে অনুরোধ করুন, credentials: 'include' রাখুন যাতে কুকি পাঠানো যায়
    let response = await fetch(url, {
        ...options,
        credentials: 'include',
    });

    // যদি response status 401 হয় (অথেনটিকেশন ফেইল)
    if (response.status === 401) {
        console.log('Access token expired, trying to refresh token...');

        // Refresh token দিয়ে নতুন access token পাওয়ার জন্য /token endpoint হিট করুন
        const refreshResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                // যদি refresh token HTTP-only কুকিতে থাকে, body প্রয়োজন হবে না
                body: JSON.stringify({}),
            }
        );

        if (refreshResponse.ok) {
            // যদি refresh token সফল হয়, পুনরায় মূল অনুরোধ করুন
            response = await fetch(url, {
                ...options,
                credentials: 'include',
            });
        } else {
            // যদি refresh token ও ব্যর্থ হয়, ইউজারকে লগইন পৃষ্ঠায় রিডাইরেক্ট করুন বা error দিন
            throw new Error('Session expired. Please login again.');
        }
    }

    return response;
}
