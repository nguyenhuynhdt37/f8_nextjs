'use client';
import React from 'react';

const CourseSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="w-full h-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>

            <div className="flex gap-4 h-[calc(100vh-10rem)]">
                {/* Main content area */}
                <div className="w-3/4 flex flex-col">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                </div>

                {/* Sidebar */}
                <div className="w-1/4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-14 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseSkeleton;
