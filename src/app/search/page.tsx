'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement search functionality
        console.log('Searching for:', searchQuery);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Tìm kiếm</h1>

            <form onSubmit={handleSearch} className="flex gap-4 mb-8">
                <div className="flex-1 relative">
                    <Input
                        type="text"
                        placeholder="Nhập từ khóa tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <Button type="submit">Tìm kiếm</Button>
            </form>

            <div className="space-y-4">
                {searchResults.length > 0 ? (
                    searchResults.map((result: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                            {/* TODO: Implement search result display */}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Chưa có kết quả tìm kiếm</p>
                )}
            </div>
        </div>
    );
} 