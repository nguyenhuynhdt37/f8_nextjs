'use client';
import React from 'react';


const PageLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
            <div className="flex flex-col items-center">
                <img
                    src="/images/loading-new.gif"
                    alt="Loading"
                    width={80}
                    height={80}
                    className="mb-4"
                />
                <div className="text-center">
                    <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Đang tải khóa học...
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Xin vui lòng đợi trong giây lát
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PageLoading;
