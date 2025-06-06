import { cookies } from 'next/headers';
import PostList from '@/components/client/post/PostList';
import { headers } from 'next/headers';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic'; // nếu cần revalidate mỗi lần load trang

async function getTypesFromAPI() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/all/type`,
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      cache: 'no-store', // hoặc revalidate: 0
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch post types');
  }

  const data = await res.json();
  return data.data;
}

export default async function PostPageServer() {
  const types = await getTypesFromAPI();

  return <PostList types={types} />;
}
