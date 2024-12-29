import Profile from '@/components/client/Profile';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';
import React from 'react';
interface Iprops {
  params: { id: string };
}
const ProfileByIdPage = async ({ params }: Iprops) => {
  const { id } = params;
  const cookieHeader = useCookie();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/info/${id}`,
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
  return <Profile user={data} />;
};

export default ProfileByIdPage;
