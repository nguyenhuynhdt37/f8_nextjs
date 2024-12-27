import PostCreate from '@/components/client/post/PostCreare';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';
import React from 'react';

const PostCreatePage = async () => {
  const cookieHeader = useCookie();
  if (!cookieHeader) {
    redirect('/404');
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/all/type`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    },
  );

  if (!res.ok) {
    redirect(`/`);
  }
  const result = await res?.json();
  const data = result?.data;
  return <PostCreate types={data} />;
};

export default PostCreatePage;
