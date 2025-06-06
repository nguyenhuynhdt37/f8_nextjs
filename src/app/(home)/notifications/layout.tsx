import NotificationsLayoutClient from '@/components/client/notifications/NotificationsLayoutClient';

export default function NotificationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <NotificationsLayoutClient>{children}</NotificationsLayoutClient>;
}
