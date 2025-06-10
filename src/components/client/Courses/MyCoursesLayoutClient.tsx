'use client';

import React from 'react';

interface MyCoursesLayoutClientProps {
    children: React.ReactNode;
}

const MyCoursesLayoutClient = ({ children }: MyCoursesLayoutClientProps) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
};

export default MyCoursesLayoutClient; 