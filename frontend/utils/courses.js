const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function coursesList() {
    const res = await fetch(`${baseUrl}/courses`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch courses');
    }

    return res.json();
}
