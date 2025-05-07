import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import RequestsFilter from './RequestsFilter';

interface FriendRequest {
    id: number;
    imageUrl: string;
    name: string;
    mutuals?: string;
}

interface FriendRequestsProps {
    requests: FriendRequest[];
    onConfirm: (id: number) => void;
    onDelete: (id: number) => void;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ requests, onConfirm, onDelete }) => {
    const [filteredRequests, setFilteredRequests] = useState<FriendRequest[]>(requests);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (searchQuery) {
            const filtered = requests.filter(request =>
                request.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRequests(filtered);
        } else {
            setFilteredRequests(requests);
        }
    }, [searchQuery, requests]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilter = () => {
        // For now, this is just a placeholder
        console.log('Filter button clicked');
        // In a real implementation, this could open a filter modal
    };

    return (
        <div className="w-full">
            <RequestsFilter onSearch={handleSearch} onFilter={handleFilter} />

            {filteredRequests.length === 0 ? (
                <div className="bg-white p-10 rounded-lg shadow text-center">
                    <p className="text-xl text-gray-500">
                        {searchQuery
                            ? `Không tìm thấy lời mời kết bạn nào phù hợp với "${searchQuery}"`
                            : "Bạn không có lời mời kết bạn nào."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-xl text-gray-700">{filteredRequests.length} lời mời kết bạn</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRequests.map((request) => (
                            <UserCard
                                key={request.id}
                                id={request.id}
                                imageUrl={request.imageUrl}
                                name={request.name}
                                mutuals={request.mutuals}
                                type="request"
                                onConfirm={onConfirm}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FriendRequests;