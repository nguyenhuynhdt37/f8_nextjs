"use client";

import { startSignalRConnection } from "@/lib/signalr";
import { useAppDispatch } from "@/redux/hook/hook";
import { addNotification } from "@/redux/reducers/slices/NotificationSlice";
import { useEffect, useState } from "react";
import { toast, Toaster } from 'sonner';
import { Lexend } from 'next/font/google';
import * as signalR from '@microsoft/signalr';


const lexend = Lexend({
    weight: ['400', '100', '200', '300', '500', '600', '700'],
    subsets: ['latin', 'vietnamese'],
});

export default function NotificationListener() {
    const dispatch = useAppDispatch();
    const [connection, setConnection] = useState<any>(null);
    useEffect(() => {
        const initializeConnection = async () => {
            const connection = await startSignalRConnection('notificationHub');
            console.log('SignalR connection noti', connection);

            connection.on('ReceiveMessage', (message) => {
                console.log('ReceiveMessage:', message);
            });


            connection.on("ReceiveNotification", (data: any) => {
                console.log("Received notification:", data);
                if (data) {
                    dispatch(addNotification(data));
                    switch (data?.entityType) {
                        case "FriendRequest":
                            toast.custom(() => (
                                <div className={lexend.className}>
                                    <div className="flex py-4 px-5 shadow-xl rounded-xl bg-white items-center gap-3">
                                        <img
                                            src={data?.extraData?.avatar || "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/18/457/avatar-mac-dinh-11.jpg"}
                                            alt="avatar"
                                            className="w-16 h-16 object-cover rounded-full"
                                        />
                                        <div>
                                            <strong className="font-bold text-2xl">{data?.title}</strong>
                                            <p className="text-xl py-2">{data?.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ));
                            break;

                        default:
                            break;
                    }
                }
            });

            try {
                // Kiểm tra nếu kết nối đã được thiết lập thì không kết nối lại
                if (connection.state === signalR.HubConnectionState.Disconnected) {
                    await connection.start();
                    console.log('SignalR connected');
                } else {
                    console.log('SignalR already connected, state:', connection.state);
                }
            } catch (err) {
                console.error('SignalR error:', err);
            }

            setConnection(connection);
        };

        initializeConnection();

        return () => {
            if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
                connection.stop();
            }
        };
    }, []);


    return <Toaster position="bottom-right" richColors />;
}
