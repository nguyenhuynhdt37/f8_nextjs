import PostCreate from '@/components/client/post/PostCreare';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

// Loading component
const LoadingComponent = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      <p className="mt-4 text-lg text-gray-600">Đang tải...</p>
    </div>
  </div>
);

async function getPostTypes() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/all/type`,
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      throw new Error('Failed to fetch post types');
    }

    const result = await res.json();
    return result?.data || [];
  } catch (error) {
    console.error('Error fetching post types:', error);
    return [];
  }
}

export default async function PostCreatePage() {
  const types = await getPostTypes();

  // Redirect if no types are available (likely due to authentication issues)
  if (!types || types.length === 0) {
    redirect('/post');
  }

  return (
    <Suspense fallback={<LoadingComponent />}>
      <PostCreate types={types} />
    </Suspense>
  );
}
