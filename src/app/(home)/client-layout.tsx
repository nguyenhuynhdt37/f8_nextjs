import ClientLayout from '@/components/client/layout/ClientLayout';

export default function HomeClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ClientLayout>{children}</ClientLayout>;
}
