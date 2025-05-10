import { getCourseInfo } from '@/api/axios/api';
import { Content, CourseInfo } from '@/components/client/courses';
import LoadingPage from '@/components/client/LoadingPage';
import { useCookie } from '@/hook/useCookie';
import { convertSecondsToYMDHMS } from '@/Utils/functions';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface CoursePageProps {
  params: { id: string };
}

const fetchCourseData = async (id: string) => {
  const cookieHeader = useCookie();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${id}`,
    {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    },
  );
  if (!res.ok) {
    redirect("/404");
  }

  const data = await res.json();
  return data?.data;
};
const fetchIsRegister = async (id: string) => {
  const cookieHeader = useCookie();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/user/check-course-is-register/${id}`,
    {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    },
  );
  if (res.ok) {
    redirect('/learning/' + id);
    return;
  }
};

const CoursePage = async ({ params }: CoursePageProps) => {
  const { id } = params || {};
  await fetchIsRegister(id);
  const content = await fetchCourseData(id);
  if (!content || content.lessonGroups?.length === 0) {
    return (
      <div
        className="min-h-screen relative flex items-center justify-center px-4 text-center"
        style={{
          backgroundImage: "url('/images/walking-investigator-animation-in-404-error.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 w-full max-w-2xl p-16 bg-white bg-opacity-80 backdrop-blur-md rounded-3xl border border-white border-opacity-30 shadow-2xl">
          <h1 className="text-6xl font-extrabold text-indigo-900 mb-6">
            Khoá học đang được phát triển
          </h1>
          <p className="text-xl text-indigo-700 mb-10 leading-relaxed">
            Chúng tôi đang hoàn thiện nội dung của khóa học này. Vui lòng quay lại sau để không bỏ lỡ bất kỳ cập nhật thú vị nào!
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 text-lg font-medium bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-shadow shadow-md hover:shadow-lg"
          >
            Trở về trang chủ
          </Link>
        </div>
      </div>
    );
  }
  // console.log('content', content);

  const totalSecconsCourse = content?.lessonGroups?.reduce(
    (store: number, group: any) => {
      group?.lectureDetail?.forEach((item: any) => {
        if (item?.lesson?.duration) {
          store += item?.lesson?.duration;
        }
      });
      return store;
    },
    0
  );
  console.log('content', totalSecconsCourse);
  const totalLesson = content?.lessonGroups?.reduce(
    (store: number, group: any) => {
      if (group?.lectureDetail?.length > 0) {
        store += group?.lectureDetail?.length;
      }
      return store;
    },
    0,
  );

  const fomartTimeCourse = convertSecondsToYMDHMS(totalSecconsCourse || 0);
  return (
    <div className="container pb-20 mx-auto pt-5 grid grid-cols-3">
      <Content
        totalLesson={totalLesson}
        timeCourse={fomartTimeCourse}
        data={content}
        courseId={id}
      />
      <CourseInfo
        totalLesson={totalLesson}
        data={content}
        timeCourse={fomartTimeCourse}
      />
    </div>
  );
};

export default CoursePage;
