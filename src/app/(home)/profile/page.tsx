import Profile from '@/components/client/Profile';
import PageTransition from '@/components/ui/PageTransition';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';
import React from 'react';

interface Iprops {
  params: { id: string };
}
const ProfilePage = async () => {
  return (
    <>
      <PageTransition>
        <Profile user={null} />
      </PageTransition>
    </>
  );
};

export default ProfilePage;
