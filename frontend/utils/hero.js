const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getHeroes() {
  const res = await fetch(`${baseUrl}/heroes`, {
    next: { revalidate: 3600 }, // 1 hour
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Hero image');
  }

  return res.json();
}
