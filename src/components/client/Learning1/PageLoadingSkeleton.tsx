'use client';
import React from 'react';

import CourseSkeleton from './CourseSkeleton';

const PageLoadingSkeleton = () => {
  return (
    <div className="relative min-h-screen">
      {/* Loading overlay with logo */}
      <div className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-gray-800 z-40 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <img
            src="/logo/logo1.png"
            alt="F8 Logo"
            width={40}
            height={40}
            className="mr-3"
          />
          <div className="h-5 w-7 relative">
            <div className="absolute top-0 h-5 w-2 bg-blue-500 rounded-sm animate-loading-1"></div>
            <div className="absolute top-0 left-2.5 h-5 w-2 bg-blue-500 rounded-sm animate-loading-2"></div>
            <div className="absolute top-0 left-5 h-5 w-2 bg-blue-500 rounded-sm animate-loading-3"></div>
          </div>
        </div>
      </div>

      {/* Skeleton content */}
      <div className="pt-16">
        <CourseSkeleton />
      </div>

      <style jsx>{`
        @keyframes loading {
          0%, 100% { height: 5px; }
          50% { height: 20px; }
        }
        
        :global(.animate-loading-1) {
          animation: loading 1s ease-in-out 0s infinite;
        }
        
        :global(.animate-loading-2) {
          animation: loading 1s ease-in-out 0.2s infinite;
        }
        
        :global(.animate-loading-3) {
          animation: loading 1s ease-in-out 0.4s infinite;
        }
      `}</style>
    </div>
  );
};

export default PageLoadingSkeleton;
