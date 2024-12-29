import PostList from '@/components/client/post/PostList';
import PostListByType from '@/components/client/post/PostListByType/page';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';
import React from 'react';
interface Iprops {
  params: { id: string };
}
const PostPageByPostType = async ({ params }: Iprops) => {
  const { id } = params;
  const cookieHeader = useCookie();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/all/type`,
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
  return <PostListByType types={data} id={id} />;
};

export default PostPageByPostType;
