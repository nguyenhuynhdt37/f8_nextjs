import Profile from '@/components/client/Profile';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';
import React from 'react';

interface Iprops {
  params: { slug: string };
}

const ProfileByIdPage = async ({ params }: Iprops) => {
  const { slug } = params;

  // Extract user ID from slug if it's not a pure ID
  let userId: string;

  if (/^\d+$/.test(slug)) {
    userId = slug;
  } else {
    // Extract ID from the end of the slug (after the last dash)
    const idMatch = slug.match(/-(\d+)$/);
    userId = idMatch ? idMatch[1] : slug;
  }

  const cookieHeader = useCookie();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/info/${userId}`,
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
