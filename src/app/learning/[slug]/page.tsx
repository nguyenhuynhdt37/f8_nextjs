import { redirect } from 'next/navigation';
import Learning from '@/components/client/Learning';
import { useCookie } from '@/hook/useCookie';
import { extractIdFromSlug } from '@/Utils/functions/slugify';

interface Iprops {
    params: { slug: string };
}
const CourseDetail = async ({ params }: Iprops) => {
    const { slug } = params;
    const id = extractIdFromSlug(slug);
    if (!id) {
        redirect('/404');
    }
    const cookieHeader = useCookie();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/get-course-is-register-${id}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
        },
    );

    if (!res.ok) {
        redirect(`/courses/${id}`);
    }
    const result = await res?.json();
    const data = result?.data;
    return (
        <>
            <Learning courseId={id} dataLearning={data} />
        </>
    );
};

export default CourseDetail;