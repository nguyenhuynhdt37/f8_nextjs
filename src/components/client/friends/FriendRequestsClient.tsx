'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/client/friends/Sidebar';
import FriendRequests from '@/components/client/friends/FriendRequests';
import useFriendRequests from '@/hook/useFriendRequests';

const FriendRequestsClient = () => {
    const [activeTab, setActiveTab] = useState(1); // Set to 1 for "Lời mời kết bạn"

    // Dữ liệu mẫu cho lời mời kết bạn
    const initialRequests = [
        {
            id: 1,
            imageUrl: '/images/avatar-empty.png',
            name: 'Nguyễn Văn A',
            mutuals: '5 bạn chung'
        },
        {
            id: 2,
            imageUrl: '/images/avatar-empty.png',
            name: 'Trần Thị B',
            mutuals: '2 bạn chung'
        },
        {
            id: 3,
            imageUrl: '/images/avatar-empty.png',
            name: 'Lê Văn C',
            mutuals: '8 bạn chung'
        },
        {
            id: 4,
            imageUrl: '/images/avatar-empty.png',
            name: 'Phạm Thị D',
            mutuals: '3 bạn chung'
        },
        {
            id: 5,
            imageUrl: '/images/avatar-empty.png',
            name: 'Hoàng Văn E',
            mutuals: '1 bạn chung'
        },
        {
            id: 6,
            imageUrl: '/images/avatar-empty.png',
            name: 'Vũ Thị F',
            mutuals: '7 bạn chung'
        }
    ];

    // Use our custom hook to manage friend requests
    const { requests, confirmRequest, deleteRequest } = useFriendRequests(initialRequests);

    return (
        <div className="flex h-[calc(100vh-5rem)] bg-white">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto p-8 bg-gray-50">
                    <h1 className="text-3xl font-bold mb-8 text-gray-800">Lời mời kết bạn</h1>
                    <FriendRequests
                        requests={requests}
                        onConfirm={confirmRequest}
                        onDelete={deleteRequest}
                    />
                </div>
            </div>
        </div>
    );
};

export default FriendRequestsClient;
