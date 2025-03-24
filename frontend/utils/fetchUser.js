const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getUsers() {
    const res = await fetch(`${baseUrl}/users`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch get all users');
    }

    return res.json();
}


// Create User
export async function createUser(userData) {
    const res = await fetch(`${baseUrl}/users/register`, {
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
export const verifyUser = async (jwt) => {
    try {
        const response = await fetch('http://localhost:8080/api/users/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: jwt }), // Send the token just like in Postman
        });

        if (!response.ok) {
            throw new Error('Verification failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};
