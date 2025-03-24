import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid Token' }, { status: 401 });
  }

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
      next: { revalidate: 1 }, // Force revalidate
    });

    return NextResponse.json(
      { message: `Revalidated: ${path}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Revalidation Error' },
      { status: 500 }
    );
  }
}
