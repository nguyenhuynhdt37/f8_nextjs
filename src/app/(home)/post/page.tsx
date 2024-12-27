import PostList from '@/components/client/post/PostList';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';
import React from 'react';
const PostPage = async () => {
  const cookieHeader = useCookie();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/all/type`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    },
  );

  if (!res.ok) {
    redirect(`/404`);
  }
  const result = await res?.json();
  const data = result?.data;
  return <PostList types={data} />;
};

export default PostPage;
