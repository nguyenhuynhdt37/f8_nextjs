'use client';
import React from 'react';
import NavigationProgress from '@/components/client/Loading/NavigationProgress';

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* <NavigationProgress /> */}
            {children}
        </>
    );
}
