import { useState, useCallback } from 'react';

interface FriendRequest {
    id: number;
    imageUrl: string;
    name: string;
    mutuals?: string;
}

export const useFriendRequests = (initialRequests: FriendRequest[]) => {
    const [requests, setRequests] = useState<FriendRequest[]>(initialRequests);

    const confirmRequest = useCallback((id: number) => {
        // In a real app, you would call an API here
        // For now, just remove the request from the list
        setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
        // Show success notification or handle UI updates
        console.log(`Confirmed friend request from user ${id}`);
    }, []);

    const deleteRequest = useCallback((id: number) => {
        // In a real app, you would call an API here
        // For now, just remove the request from the list
        setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
        // Show notification or handle UI updates
        console.log(`Deleted friend request from user ${id}`);
    }, []);

    return {
        requests,
        confirmRequest,
        deleteRequest
    };
};

export default useFriendRequests;