import PostById from '@/components/client/post/PostById';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';

interface Iprops {
  params: { id: string };
}
const PostByIdPage = async ({ params }: Iprops) => {
  const { id } = params;
  const cookieHeader = useCookie();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/${id}`,
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
  return <PostById data={data} />;
};

export default PostByIdPage;
