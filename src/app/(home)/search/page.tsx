'use client';

import dynamic from 'next/dynamic';

const SearchComponent = dynamic(() => import('@/components/client/search'), {
    loading: () => (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    )
});

export default function SearchPage() {
    return <SearchComponent />;
}