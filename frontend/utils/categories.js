const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function categoriesList() {
    const res = await fetch(`${baseUrl}/categories`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }

    return res.json();
}
