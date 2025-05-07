import React, { useState } from 'react';
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';
import { useChat } from './ChatContext';

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateChat: (userIds: string[]) => void;
}

const NewChatModal = ({ isOpen, onClose, onCreateChat }: NewChatModalProps) => {
    const { users, searchUsers } = useChat();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const filteredUsers = searchUsers(searchTerm).filter(
        (user) => !selectedUsers.includes(user.id)
    );

    const handleSelectUser = (userId: string) => {
        setSelectedUsers([...selectedUsers, userId]);
    };

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
    };

    const handleCreateChat = () => {
        if (selectedUsers.length > 0) {
            onCreateChat(selectedUsers);
            setSelectedUsers([]);
            setSearchTerm('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-[1.8rem] font-medium">Tạo cuộc trò chuyện mới</h3>
                    <button
                        onClick={() => {
                            setSelectedUsers([]);
                            setSearchTerm('');
                            onClose();
                        }}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <IoCloseOutline className="text-[2.4rem]" />
                    </button>
                </div>

                <div className="p-4 border-b">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            className="w-full py-3 pl-10 pr-4 border rounded-full text-[1.4rem] focus:outline-none focus:border-blue-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-[1.8rem]" />
                    </div>

                    {selectedUsers.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {selectedUsers.map(userId => {
                                const user = users.find(u => u.id === userId);
                                return (
                                    <div
                                        key={userId}
                                        className="bg-blue-100 rounded-full px-3 py-1 flex items-center"
                                    >
                                        <img
                                            src={user?.avatar}
                                            alt={user?.name}
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                        <span className="text-[1.3rem]">{user?.name}</span>
                                        <button
                                            onClick={() => handleRemoveUser(userId)}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            <IoCloseOutline className="text-[1.6rem]" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div
                                key={user.id}
                                className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                                onClick={() => handleSelectUser(user.id)}
                            >
                                <div className="relative">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    {user.status === 'online' && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                    )}
                                </div>
                                <div className="ml-3">
                                    <h4 className="text-[1.5rem] font-medium">{user.name}</h4>
                                    <p className="text-[1.3rem] text-gray-500">
                                        {user.status === 'online' ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-5 text-gray-500">
                            {searchTerm ? 'Không tìm thấy người dùng nào' : 'Chọn người dùng để trò chuyện'}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t">
                    <button
                        onClick={handleCreateChat}
                        disabled={selectedUsers.length === 0}
                        className={`w-full py-3 rounded-lg text-white text-[1.5rem] font-medium ${selectedUsers.length > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {selectedUsers.length > 1 ? 'Tạo nhóm chat' : 'Bắt đầu trò chuyện'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;