import MyCoursesLayoutClient from '@/components/client/courses/MyCoursesLayoutClient';

export default function MyCoursesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MyCoursesLayoutClient>{children}</MyCoursesLayoutClient>;
}
