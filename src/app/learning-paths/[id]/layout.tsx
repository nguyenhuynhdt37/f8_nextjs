import React from 'react';
import MainLayout from '@/layout/mainLayout';

export default function LearningPathDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout>{children}</MainLayout>;
} 