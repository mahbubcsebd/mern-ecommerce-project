const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getFaqs() {
  const res = await fetch(`${baseUrl}/faqs`, {
    next: { revalidate: 3600 }, // 1 hour
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Faq');
  }

  return res.json();
}
