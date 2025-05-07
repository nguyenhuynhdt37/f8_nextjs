import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Định nghĩa các kiểu dữ liệu
interface User {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline';
}

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read' | 'failed';
}

interface Conversation {
    id: string;
    name: string;
    avatar: string;
    lastMessage?: string;
    time?: string;
    unread: number;
    isOnline?: boolean;
    isGroup?: boolean;
    members?: number;
    users?: User[];
}

interface ChatContextType {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    messages: Message[];
    users: User[];
    loading: boolean;
    sendMessage: (content: string) => void;
    createConversation: (userIds: string[]) => Promise<string>;
    markAsRead: (conversationId: string) => void;
    searchConversations: (term: string) => Conversation[];
    searchUsers: (term: string) => User[];
    loadConversation: (conversationId: string) => void;
    deleteMessage: (messageId: string) => void;
}

// Dữ liệu mẫu
const mockUsers: User[] = [
    {
        id: 'user1',
        name: 'Nguyễn Văn A',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
        status: 'online',
    },
    {
        id: 'user2',
        name: 'Trần Thị B',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        status: 'offline',
    },
    {
        id: 'user3',
        name: 'Lê Văn C',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        status: 'online',
    },
    {
        id: 'user4',
        name: 'Phạm Thị D',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
        status: 'offline',
    },
    {
        id: 'user5',
        name: 'Hoàng Văn E',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        status: 'online',
    },
];

const mockConversations: Conversation[] = [
    {
        id: '1',
        name: 'Xuân Định',
        avatar: 'https://i.pinimg.com/originals/c9/22/3f/c9223f86147db5129229a2866d540ea4.jpg',
        lastMessage: 'Bạn đã nhận được tài liệu chưa?',
        time: '16:30',
        unread: 2,
        isOnline: true,
    },
    {
        id: '2',
        name: 'Nhóm F8 NextJS',
        avatar: '/images/logo.png',
        lastMessage: 'Tuấn: Cảm ơn mọi người đã tham gia!',
        time: '15:45',
        unread: 0,
        isGroup: true,
        members: 6,
    },
    {
        id: '3',
        name: 'Minh Anh',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        lastMessage: 'Oke, hẹn gặp lại bạn vào buổi học tới',
        time: 'Hôm qua',
        unread: 0,
        isOnline: false,
    },
    {
        id: '4',
        name: 'Phòng chat công việc',
        avatar: '/images/logo.png',
        lastMessage: 'Văn Đạt: Dự án sẽ được giới thiệu vào ngày mai',
        time: 'Hôm qua',
        unread: 5,
        isGroup: true,
        members: 12,
    },
];

// Tạo dữ liệu mẫu cho nhiều cuộc trò chuyện
const generateMessagesByConversationId = (conversationId: string): Message[] => {
    if (conversationId === '1') {
        return [
            {
                id: '1-1',
                conversationId: '1',
                senderId: 'other',
                content: 'Chào bạn, dạo này công việc thế nào rồi?',
                timestamp: new Date(2023, 4, 2, 9, 30),
                status: 'read',
            },
            {
                id: '1-2',
                conversationId: '1',
                senderId: 'me',
                content: 'Mình vẫn ổn, đang làm một dự án mới về NextJS, khá thú vị!',
                timestamp: new Date(2023, 4, 2, 9, 32),
                status: 'read',
            },
            {
                id: '1-3',
                conversationId: '1',
                senderId: 'other',
                content: 'Nghe hay đấy! Bạn học NextJS lâu chưa?',
                timestamp: new Date(2023, 4, 2, 9, 33),
                status: 'read',
            },
            {
                id: '1-4',
                conversationId: '1',
                senderId: 'me',
                content: 'Mình mới học khoảng 3 tháng thôi, nhưng thấy nó rất mạnh mẽ và linh hoạt.',
                timestamp: new Date(2023, 4, 2, 9, 35),
                status: 'read',
            },
            {
                id: '1-5',
                conversationId: '1',
                senderId: 'other',
                content: 'Tuyệt! Bạn đã nhận được tài liệu chưa?',
                timestamp: new Date(),
                status: 'read',
            },
        ];
    } else if (conversationId === '2') {
        return [
            {
                id: '2-1',
                conversationId: '2',
                senderId: 'other',
                content: 'Xin chào mọi người, chúng ta sẽ có buổi họp vào thứ 2 tuần sau.',
                timestamp: new Date(2023, 4, 3, 10, 0),
                status: 'read',
            },
            {
                id: '2-2',
                conversationId: '2',
                senderId: 'me',
                content: 'Tôi sẽ chuẩn bị tài liệu cho buổi họp.',
                timestamp: new Date(2023, 4, 3, 10, 5),
                status: 'read',
            },
            {
                id: '2-3',
                conversationId: '2',
                senderId: 'other',
                content: 'Cảm ơn mọi người đã tham gia!',
                timestamp: new Date(),
                status: 'read',
            },
        ];
    } else if (conversationId === '3') {
        return [
            {
                id: '3-1',
                conversationId: '3',
                senderId: 'other',
                content: 'Bạn đã hoàn thành khoá học chưa?',
                timestamp: new Date(2023, 4, 4, 14, 30),
                status: 'read',
            },
            {
                id: '3-2',
                conversationId: '3',
                senderId: 'me',
                content: 'Mình sắp hoàn thành rồi, còn vài bài cuối.',
                timestamp: new Date(2023, 4, 4, 14, 35),
                status: 'read',
            },
            {
                id: '3-3',
                conversationId: '3',
                senderId: 'other',
                content: 'Oke, hẹn gặp lại bạn vào buổi học tới',
                timestamp: new Date(),
                status: 'read',
            },
        ];
    } else if (conversationId === '4') {
        return [
            {
                id: '4-1',
                conversationId: '4',
                senderId: 'other',
                content: 'Chào team, chúng ta cần hoàn thành dự án vào cuối tháng này.',
                timestamp: new Date(2023, 4, 5, 9, 0),
                status: 'read',
            },
            {
                id: '4-2',
                conversationId: '4',
                senderId: 'me',
                content: 'Tôi đã hoàn thành phần frontend.',
                timestamp: new Date(2023, 4, 5, 9, 10),
                status: 'read',
            },
            {
                id: '4-3',
                conversationId: '4',
                senderId: 'other',
                content: 'Tôi đang làm phần API, sẽ hoàn thành trong tuần này.',
                timestamp: new Date(2023, 4, 5, 9, 15),
                status: 'read',
            },
            {
                id: '4-4',
                conversationId: '4',
                senderId: 'other',
                content: 'Dự án sẽ được giới thiệu vào ngày mai',
                timestamp: new Date(),
                status: 'read',
            },
        ];
    }

    return [];
};

// Tạo Context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider Component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();

    // Tải dữ liệu ban đầu một lần duy nhất
    useEffect(() => {
        setConversations(mockConversations);
    }, []);

    // Theo dõi thay đổi của params.id và cập nhật cuộc trò chuyện hiện tại
    useEffect(() => {
        const conversationId = params?.id as string;
        if (conversationId && conversations.length > 0) {
            const conversation = conversations.find(conv => conv.id === conversationId);
            if (conversation) {
                setCurrentConversation(conversation);
                // Tải tin nhắn tương ứng với cuộc trò chuyện
                const conversationMessages = generateMessagesByConversationId(conversationId);
                setMessages(conversationMessages);
                // Đánh dấu đã đọc
                markAsRead(conversationId);
            }
        }
    }, [params?.id, conversations]);

    // Hàm load conversation - chỉ cập nhật route, không cập nhật state trực tiếp
    const loadConversation = useCallback((conversationId: string) => {
        if (conversationId) {
            router.push(`/chat/${conversationId}`);
        }
    }, [router]);

    // Gửi tin nhắn mới
    const sendMessage = (content: string) => {
        if (!currentConversation || !content.trim()) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            conversationId: currentConversation.id,
            senderId: 'me',
            content: content.trim(),
            timestamp: new Date(),
            status: 'sent',
        };

        setMessages(prev => [...prev, newMessage]);

        // Cập nhật cuộc trò chuyện với tin nhắn mới nhất
        setConversations(prev =>
            prev.map(conv =>
                conv.id === currentConversation.id
                    ? {
                        ...conv,
                        lastMessage: content.trim(),
                        time: 'Vừa xong'
                    }
                    : conv
            )
        );

        // Mô phỏng việc gửi tin nhắn lên server và nhận phản hồi
        setTimeout(() => {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === newMessage.id
                        ? { ...msg, status: 'delivered' }
                        : msg
                )
            );

            // Sau một khoảng thời gian, đánh dấu tin nhắn là đã đọc
            setTimeout(() => {
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === newMessage.id
                            ? { ...msg, status: 'read' }
                            : msg
                    )
                );
            }, 2000);
        }, 1000);
    };

    // Tạo cuộc trò chuyện mới
    const createConversation = async (userIds: string[]): Promise<string> => {
        return new Promise((resolve) => {
            setLoading(true);

            setTimeout(() => {
                // Mô phỏng việc tạo cuộc trò chuyện mới
                const isGroup = userIds.length > 1;
                const selectedUsers = mockUsers.filter(user => userIds.includes(user.id));

                const newConversation: Conversation = {
                    id: `new-${Date.now()}`,
                    name: isGroup
                        ? `Nhóm mới (${selectedUsers.length + 1})`
                        : selectedUsers[0]?.name || 'Người dùng',
                    avatar: isGroup
                        ? '/images/logo.png'
                        : selectedUsers[0]?.avatar || '',
                    unread: 0,
                    isGroup,
                    members: isGroup ? selectedUsers.length + 1 : undefined,
                    isOnline: !isGroup ? selectedUsers[0]?.status === 'online' : undefined,
                    users: selectedUsers,
                };

                setConversations(prev => [newConversation, ...prev]);
                setCurrentConversation(newConversation);
                setMessages([]);
                setLoading(false);

                resolve(newConversation.id);
            }, 800);
        });
    };

    // Đánh dấu tin nhắn là đã đọc
    const markAsRead = (conversationId: string) => {
        setConversations(prev =>
            prev.map(conv =>
                conv.id === conversationId
                    ? { ...conv, unread: 0 }
                    : conv
            )
        );
    };

    // Tìm kiếm cuộc trò chuyện
    const searchConversations = (term: string): Conversation[] => {
        if (!term) return conversations;

        return conversations.filter(conv =>
            conv.name.toLowerCase().includes(term.toLowerCase())
        );
    };

    // Tìm kiếm người dùng
    const searchUsers = (term: string): User[] => {
        if (!term) return mockUsers;

        return mockUsers.filter(user =>
            user.name.toLowerCase().includes(term.toLowerCase())
        );
    };

    // Xóa tin nhắn
    const deleteMessage = (messageId: string) => {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
    };

    return (
        <ChatContext.Provider
            value={{
                conversations,
                currentConversation,
                messages,
                users: mockUsers,
                loading,
                sendMessage,
                createConversation,
                markAsRead,
                searchConversations,
                searchUsers,
                loadConversation,
                deleteMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useChat = () => {
    const context = useContext(ChatContext);

    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }

    return context;
};