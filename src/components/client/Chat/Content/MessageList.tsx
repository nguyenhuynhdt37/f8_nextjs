import React, { useEffect, useRef } from 'react';
import { useChat } from '../ChatContext';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';

// Component hiển thị thời gian cho nhóm tin nhắn
const DateDivider = ({ date }: { date: Date }) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let displayDate;

    if (date.toDateString() === today.toDateString()) {
        displayDate = 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
        displayDate = 'Hôm qua';
    } else {
        displayDate = format(date, 'dd/MM/yyyy', { locale: vi });
    }

    return (
        <div className="flex justify-center my-4">
            <div className="px-3 py-1 text-[1.2rem] bg-gray-100 text-gray-500 rounded-full">
                {displayDate}
            </div>
        </div>
    );
};

// Component hiển thị 1 tin nhắn
const Message = ({ message, isFirst, isLast }: { message: any; isFirst: boolean; isLast: boolean }) => {
    const isMe = message.senderId === 'me';

    // Xác định loại tin nhắn (đầu, giữa, cuối) để áp dụng kiểu bo góc phù hợp
    const messagePositionClass = isMe
        ? `${isFirst ? 'rounded-t-2xl rounded-bl-2xl' : ''} ${isLast ? 'rounded-b-2xl rounded-bl-2xl' : ''} ${!isFirst && !isLast ? 'rounded-bl-2xl' : ''}`
        : `${isFirst ? 'rounded-t-2xl rounded-br-2xl' : ''} ${isLast ? 'rounded-b-2xl rounded-br-2xl' : ''} ${!isFirst && !isLast ? 'rounded-br-2xl' : ''}`;

    const defaultRoundedClass = isMe
        ? 'rounded-l-2xl rounded-tr-2xl'
        : 'rounded-r-2xl rounded-tl-2xl';

    // Xử lý trạng thái tin nhắn
    const renderStatus = () => {
        if (isMe && isLast) {
            switch (message.status) {
                case 'sent':
                    return (
                        <span className="ml-2 text-gray-400 text-[1rem]">
                            <svg className="w-4 h-4" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                    );
                case 'delivered':
                    return (
                        <span className="ml-2 text-gray-400 text-[1rem]">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7M5 13l4 4L19 7" />
                            </svg>
                        </span>
                    );
                case 'read':
                    return (
                        <span className="ml-2 text-blue-500 text-[1rem]">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7M5 13l4 4L19 7" />
                            </svg>
                        </span>
                    );
                default:
                    return null;
            }
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}
        >
            <div className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[85%]`}>
                {(!isMe && isLast) && (
                    <div className="flex-shrink-0 w-8 h-8 mr-2 rounded-full overflow-hidden">
                        <img
                            src="https://i.pinimg.com/originals/c9/22/3f/c9223f86147db5129229a2866d540ea4.jpg"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className={`px-4 py-2 ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} ${messagePositionClass || defaultRoundedClass}`}>
                    <p className="text-[1.4rem] whitespace-pre-wrap break-words">{message.content}</p>
                </div>

                {renderStatus()}
            </div>
        </motion.div>
    );
};

// Component chính hiển thị danh sách tin nhắn
const MessageList = () => {
    const { messages, loading, currentConversation } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll xuống cuối sau khi có tin nhắn mới
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Nhóm tin nhắn theo ngày
    const groupMessagesByDate = () => {
        const groups: { [key: string]: any[] } = {};

        messages.forEach(message => {
            const date = new Date(message.timestamp);
            const dateString = date.toDateString();

            if (!groups[dateString]) {
                groups[dateString] = [];
            }

            groups[dateString].push(message);
        });

        return Object.entries(groups).map(([dateString, messages]) => ({
            date: new Date(dateString),
            messages
        }));
    };

    // Nhóm tin nhắn liên tiếp từ cùng một người
    const groupConsecutiveMessages = (messages: any[]) => {
        const groups: any[] = [];
        let currentGroup: any[] = [];
        let currentSender = '';

        messages.forEach((message, index) => {
            if (message.senderId !== currentSender) {
                if (currentGroup.length > 0) {
                    groups.push(currentGroup);
                }
                currentGroup = [message];
                currentSender = message.senderId;
            } else {
                currentGroup.push(message);
            }

            // Thêm nhóm cuối cùng
            if (index === messages.length - 1) {
                groups.push(currentGroup);
            }
        });

        return groups;
    };

    // Hiển thị tin nhắn đang tải
    if (loading || !currentConversation) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        );
    }

    // Hiển thị khi không có tin nhắn
    if (messages.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center text-gray-500">
                <div className="w-20 h-20 mb-4">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <p className="text-[1.6rem] mb-2">Bắt đầu cuộc trò chuyện</p>
                <p className="text-[1.4rem] text-center max-w-xs">Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện với {currentConversation.name}</p>
            </div>
        );
    }

    // Nhóm tin nhắn
    const dateGroups = groupMessagesByDate();

    return (
        <div className="flex-1 p-4 overflow-y-auto">
            {dateGroups.map((dateGroup, dateIndex) => (
                <div key={dateIndex}>
                    <DateDivider date={dateGroup.date} />

                    {groupConsecutiveMessages(dateGroup.messages).map((group, groupIndex) => (
                        <div key={groupIndex} className="mb-3">
                            {group.map((message: any, messageIndex: number) => (
                                <Message
                                    key={message.id}
                                    message={message}
                                    isFirst={messageIndex === 0}
                                    isLast={messageIndex === group.length - 1}
                                />
                            ))}

                            {/* Hiển thị thời gian ở cuối mỗi nhóm tin nhắn */}
                            <div className={`flex ${group[0].senderId === 'me' ? 'justify-end' : 'justify-start'} mb-2`}>
                                <span className="text-[1.1rem] text-gray-500 px-2">
                                    {format(new Date(group[group.length - 1].timestamp), 'HH:mm')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;