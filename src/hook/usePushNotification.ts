import { useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

export const useSignalR = () => {
    useEffect(() => {
        const connect = new HubConnectionBuilder()
            .withUrl('https://your-backend-server/notificationhub')
            .withAutomaticReconnect()
            .build();

        connect.start()
            .then(() => console.log('SignalR Connected'))
            .catch(err => console.error('SignalR Error:', err));

        connect.on('ReceiveMessage', (message) => {
            console.log('Tin nhắn nhận:', message);
            // Xử lý hiển thị tin nhắn mới tại đây
        });

        return () => {
            connect.stop();
        };
    }, []);
};
