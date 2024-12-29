import PostCreate from '@/components/client/post/PostCreare';
import PostEdit from '@/components/client/post/PostEdit';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';
import React from 'react';
interface Iprops {
  params: { id: string };
}
const PostCreatePage = async ({ params }: Iprops) => {
  const { id } = params;
  const cookieHeader = useCookie();
  if (!cookieHeader) {
    redirect('/404');
  }
  const resPost = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/${id}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    },
  );
  if (!resPost.ok) {
    redirect(`/404`);
  }
  const resultPost = await resPost?.json();
  const dataPost = resultPost?.data;
  if (dataPost?.isOwner === false) {
    redirect(`/404`);
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/all/type`,
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
  return <PostEdit post={dataPost} types={data} />;
};

export default PostCreatePage;
