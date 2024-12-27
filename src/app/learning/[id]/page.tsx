import { redirect } from 'next/navigation';
import { message } from 'antd';
import Learning from '@/components/client/Learning';
import { useCookie } from '@/hook/useCookie';

interface Iprops {
  params: { id: string };
}
const CourseDetail = async ({ params }: Iprops) => {
  const { id } = params;
  const cookieHeader = useCookie();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/get-course-is-register-${id}`,
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
