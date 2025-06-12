import React from 'react';


interface FriendRequestItemProps {
    id: number;
    imageUrl?: string; // Allow imageUrl to be optional
    name: string;
    mutuals?: string;
    time?: string;
    followers?: string;
    onConfirm: (id: number) => void;
    onDelete: (id: number) => void;
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({
    id,
    imageUrl = '/images/avatar-empty.png', // Use fallback image if imageUrl is undefined
    name,
    mutuals,
    time,
    followers,
    onConfirm,
    onDelete
}) => {
    return (
        <div className="flex items-start py-4 border-b border-gray-200">
            {/* User avatar */}
            <div className="w-16 h-16 mr-4 rounded-full overflow-hidden flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* User info */}
            <div className="flex-grow">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h4 className="text-lg font-medium">{name}</h4>
                        {mutuals && (
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center mr-1">
                                    <span className="text-xs">👥</span>
                                </span>
                                {mutuals}
                            </div>
                        )}
                        {followers && <p className="text-sm text-gray-500 mt-1">Followed by {followers}</p>}
                    </div>
                    {time && <span className="text-sm text-gray-500">{time}</span>}
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => onConfirm(id)}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => onDelete(id)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FriendRequestItem;