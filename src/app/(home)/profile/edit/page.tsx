import React from 'react';
import ProfileEditForm from '@/components/client/Profile/ProfileEditForm';
import PageTransition from '@/components/ui/PageTransition';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'F8 - Chỉnh sửa hồ sơ',
    description: 'Chỉnh sửa hồ sơ của bạn',
}


const ProfileEditPage = () => {
    return (
        <PageTransition>
            <ProfileEditForm />
        </PageTransition>
    );
};

export default ProfileEditPage; 