import Profile from '@/components/client/Profile';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';
import React from 'react';

interface IProps {
  params: { slug: string };
}

const ProfileByIdPage = async ({ params }: IProps) => {
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

  // Fetch user profile data
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/info/${userId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    redirect('/404');
  }

  const result = await res.json();

  if (result.statusCode !== 200 || !result.data) {
    redirect('/404');
  }

  const data = result.data;

  // Fetch user statistics
  let statistics = null;
  try {
    const statsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile/statistics`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
        cache: 'no-store',
      },
    );

    if (statsRes.ok) {
      const statsResult = await statsRes.json();
      if (statsResult.statusCode === 200 && statsResult.data) {
        statistics = statsResult.data;
      }
    }
  } catch (error) {
    console.error('Error fetching user statistics:', error);
  }

  // Combine user data with statistics
  const userData = {
    user: data.user,
    courses: data.courses,
    statistics
  };

  return <Profile user={userData} />;
};

export default ProfileByIdPage;
