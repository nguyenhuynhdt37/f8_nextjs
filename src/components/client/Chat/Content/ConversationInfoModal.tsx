import React, { useState } from 'react';
import { IoCloseOutline, IoSettingsOutline, IoNotificationsOutline, IoSearchOutline } from 'react-icons/io5';
import { FaImages, FaFileAlt, FaLink } from 'react-icons/fa';
import { BsShieldLock } from 'react-icons/bs';

interface ConversationInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversation: any;
}

const ConversationInfoModal = ({ isOpen, onClose, conversation }: ConversationInfoModalProps) => {
    const [activeTab, setActiveTab] = useState('members');

    if (!isOpen || !conversation) return null;

    // Dữ liệu mẫu cho thành viên nhóm (nếu là nhóm)
    const mockMembers = [
        {
            id: 'user1',
            name: 'Nguyễn Văn A',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
            status: 'online',
            role: 'admin',
        },
        {
            id: 'user2',
            name: 'Trần Thị B',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
            status: 'offline',
            role: 'member',
        },
        {
            id: 'user3',
            name: 'Lê Văn C',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
            status: 'online',
            role: 'member',
        },
    ];

    // Dữ liệu mẫu cho file đã chia sẻ
    const mockFiles = [
        {
            id: 'file1',
            name: 'Project-presentation.pdf',
            type: 'pdf',
            size: '2.4 MB',
            date: '20/04/2023',
            url: '#',
        },
        {
            id: 'file2',
            name: 'Meeting-notes.docx',
            type: 'docx',
            size: '1.2 MB',
            date: '15/04/2023',
            url: '#',
        },
    ];

    // Dữ liệu mẫu cho hình ảnh đã chia sẻ
    const mockImages = [
        {
            id: 'img1',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
            date: '25/04/2023',
        },
        {
            id: 'img2',
            url: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf',
            date: '23/04/2023',
        },
        {
            id: 'img3',
            url: 'https://images.unsplash.com/photo-1616763355603-9755a640a287',
            date: '20/04/2023',
        },
        {
            id: 'img4',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
            date: '18/04/2023',
        },
    ];

    // Dữ liệu mẫu cho liên kết đã chia sẻ
    const mockLinks = [
        {
            id: 'link1',
            url: 'https://example.com/article1',
            title: 'Hướng dẫn sử dụng NextJS',
            preview: 'Bài viết hướng dẫn chi tiết cách sử dụng NextJS cho người mới bắt đầu',
            date: '22/04/2023',
        },
        {
            id: 'link2',
            url: 'https://example.com/article2',
            title: 'Tối ưu hiệu suất ứng dụng React',
            preview: 'Các kỹ thuật tối ưu hiệu suất cho ứng dụng React',
            date: '19/04/2023',
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
            <div className="bg-white h-full w-full max-w-md flex flex-col animate-slide-in-right">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-[1.8rem] font-medium">Thông tin</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <IoCloseOutline className="text-[2.4rem]" />
                    </button>
                </div>

                <div className="p-6 border-b text-center">
                    <div className="relative mx-auto mb-4">
                        <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gray-200"
                        />
                        {conversation.isOnline && !conversation.isGroup && (
                            <span className="absolute bottom-0 right-1/3 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                    </div>
                    <h2 className="text-[2rem] font-semibold mb-1">{conversation.name}</h2>
                    {conversation.isGroup ? (
                        <p className="text-[1.4rem] text-gray-500">{conversation.members || 0} thành viên</p>
                    ) : (
                        <p className="text-[1.4rem] text-gray-500">
                            {conversation.isOnline ? 'Đang hoạt động' : 'Hoạt động gần đây'}
                        </p>
                    )}
                </div>

                <div className="border-b">
                    <div className="grid grid-cols-4 text-center">
                        <button
                            className={`p-4 text-[1.3rem] font-medium border-b-2 ${activeTab === 'members' ? 'border-blue-500 text-blue-500' : 'border-transparent'}`}
                            onClick={() => setActiveTab('members')}
                        >
                            Thành viên
                        </button>
                        <button
                            className={`p-4 text-[1.3rem] font-medium border-b-2 ${activeTab === 'images' ? 'border-blue-500 text-blue-500' : 'border-transparent'}`}
                            onClick={() => setActiveTab('images')}
                        >
                            Hình ảnh
                        </button>
                        <button
                            className={`p-4 text-[1.3rem] font-medium border-b-2 ${activeTab === 'files' ? 'border-blue-500 text-blue-500' : 'border-transparent'}`}
                            onClick={() => setActiveTab('files')}
                        >
                            Tệp
                        </button>
                        <button
                            className={`p-4 text-[1.3rem] font-medium border-b-2 ${activeTab === 'links' ? 'border-blue-500 text-blue-500' : 'border-transparent'}`}
                            onClick={() => setActiveTab('links')}
                        >
                            Liên kết
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'members' && (
                        <div className="p-4">
                            <div className="mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm thành viên..."
                                        className="w-full py-2 pl-10 pr-4 border rounded-full text-[1.4rem] focus:outline-none focus:border-blue-400"
                                    />
                                    <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-[1.6rem]" />
                                </div>
                            </div>

                            {conversation.isGroup ? (
                                <div>
                                    {mockMembers.map(member => (
                                        <div key={member.id} className="flex items-center p-3 hover:bg-gray-100 rounded-lg">
                                            <div className="relative">
                                                <img
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                                {member.status === 'online' && (
                                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                                )}
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-[1.5rem] font-medium">{member.name}</h4>
                                                    {member.role === 'admin' && (
                                                        <span className="text-[1.2rem] bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                            Quản trị viên
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[1.3rem] text-gray-500">
                                                    {member.status === 'online' ? 'Đang hoạt động' : 'Không hoạt động'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <button className="w-full mt-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-[1.4rem] font-medium">
                                        Thêm thành viên
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center p-6">
                                    <p className="text-[1.6rem] text-gray-500">
                                        Đây là cuộc trò chuyện riêng tư
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className="p-4">
                            <div className="grid grid-cols-3 gap-2">
                                {mockImages.map(image => (
                                    <div key={image.id} className="aspect-square overflow-hidden rounded-lg">
                                        <img
                                            src={image.url}
                                            alt="Shared image"
                                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                        />
                                    </div>
                                ))}
                            </div>

                            {mockImages.length === 0 && (
                                <div className="text-center p-6">
                                    <FaImages className="text-gray-300 text-[4rem] mx-auto mb-4" />
                                    <p className="text-[1.6rem] text-gray-500">
                                        Chưa có hình ảnh nào được chia sẻ
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'files' && (
                        <div className="p-4">
                            {mockFiles.map(file => (
                                <div key={file.id} className="p-3 border rounded-lg mb-3 flex items-center">
                                    <div className="bg-blue-100 p-3 rounded-lg mr-3">
                                        <FaFileAlt className="text-blue-500 text-[2rem]" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[1.5rem] font-medium">{file.name}</h4>
                                        <p className="text-[1.3rem] text-gray-500">
                                            {file.size} • {file.date}
                                        </p>
                                    </div>
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <IoCloseOutline className="text-[2rem] text-gray-500" />
                                    </button>
                                </div>
                            ))}

                            {mockFiles.length === 0 && (
                                <div className="text-center p-6">
                                    <FaFileAlt className="text-gray-300 text-[4rem] mx-auto mb-4" />
                                    <p className="text-[1.6rem] text-gray-500">
                                        Chưa có tệp nào được chia sẻ
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'links' && (
                        <div className="p-4">
                            {mockLinks.map(link => (
                                <div key={link.id} className="p-3 border rounded-lg mb-3">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                                        <h4 className="text-[1.5rem] font-medium text-blue-600">{link.title}</h4>
                                        <p className="text-[1.3rem] text-gray-600 mb-2">{link.preview}</p>
                                        <div className="flex items-center text-[1.3rem] text-gray-500">
                                            <FaLink className="mr-2" />
                                            <span>{link.url.replace(/(^\w+:|^)\/\//, '')}</span>
                                        </div>
                                        <p className="text-right text-[1.2rem] text-gray-500 mt-2">{link.date}</p>
                                    </a>
                                </div>
                            ))}

                            {mockLinks.length === 0 && (
                                <div className="text-center p-6">
                                    <FaLink className="text-gray-300 text-[4rem] mx-auto mb-4" />
                                    <p className="text-[1.6rem] text-gray-500">
                                        Chưa có liên kết nào được chia sẻ
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t p-4">
                    <div className="flex flex-col space-y-3">
                        <button className="flex items-center p-3 hover:bg-gray-100 rounded-lg">
                            <IoNotificationsOutline className="text-[2rem] text-gray-700 mr-3" />
                            <span className="text-[1.5rem]">Tắt thông báo</span>
                        </button>
                        <button className="flex items-center p-3 hover:bg-gray-100 rounded-lg">
                            <BsShieldLock className="text-[2rem] text-gray-700 mr-3" />
                            <span className="text-[1.5rem]">Bảo mật</span>
                        </button>
                        <button className="flex items-center p-3 hover:bg-gray-100 rounded-lg">
                            <IoSettingsOutline className="text-[2rem] text-gray-700 mr-3" />
                            <span className="text-[1.5rem]">Cài đặt</span>
                        </button>
                        <button className="flex items-center p-3 hover:bg-gray-100 rounded-lg text-red-600">
                            <IoCloseOutline className="text-[2rem] mr-3" />
                            <span className="text-[1.5rem]">
                                {conversation.isGroup ? 'Rời khỏi nhóm' : 'Chặn người dùng'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationInfoModal;