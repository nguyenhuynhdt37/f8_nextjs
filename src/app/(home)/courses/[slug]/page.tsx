import { getCourseInfo } from '@/api/axios/api';
import Content from '@/components/client/coursesByID/Content';
import CourseInfo from '@/components/client/coursesByID/CourseInfo';
import LoadingPage from '@/components/client/LoadingPage';
import { useCookie } from '@/hook/useCookie';
import { convertSecondsToYMDHMS } from '@/Utils/functions';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { extractIdFromSlug } from '@/Utils/functions/slugify';
import { generateSlug } from '@/Utils/functions/slugify';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
interface CoursePageProps {
    params: { slug: string };
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
        const resData = await res.json();
        const data = resData?.data;
        const url = generateSlug(data?.title, Number(id));
        console.log('url', url);
        redirect('/learning/' + url);
        return;
    }
};

const CoursePage = async ({ params }: CoursePageProps) => {
    const { slug } = params || {};
    const extractedId = extractIdFromSlug(slug);
    // Make sure we have a valid string ID
    const id = extractedId ? String(extractedId) : "";

    if (!id) {
        redirect("/404");
    }

    await fetchIsRegister(id);
    const content = await fetchCourseData(id);
    if (!content || content.lessonGroups?.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 overflow-hidden relative">
                <div className="absolute inset-0 bg-pattern opacity-10 dark:opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="relative z-10 w-full max-w-4xl mx-4 flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl">
                    {/* Left Image Side */}
                    <div className="md:w-2/5 relative overflow-hidden bg-indigo-600 dark:bg-indigo-800">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-950 opacity-90"></div>
                        <Image
                            src="/images/walking-investigator-animation-in-404-error.png"
                            alt="Course in development"
                            width={600}
                            height={800}
                            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                        />
                        <div className="relative z-10 h-full flex flex-col justify-center p-8 text-white">
                            <div className="animate-float">
                                <svg className="w-24 h-24 mb-6 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.75 3.5C9.75 2.5335 10.5335 1.75 11.5 1.75H12.5C13.4665 1.75 14.25 2.5335 14.25 3.5V3.75H9.75V3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14.25 3.75H16.7523C17.9331 3.75 18.5235 3.75 18.8939 4.06109C19.2644 4.37218 19.3486 4.9447 19.5172 6.08974L19.7994 8.06044M19.7994 8.06044C19.9875 9.1205 20.0816 9.65053 19.8478 10.0253C19.614 10.4 19.0875 10.4 18.0345 10.4H5.96552C4.91249 10.4 4.38598 10.4 4.15223 10.0253C3.91848 9.65053 4.01251 9.1205 4.20058 8.06044M19.7994 8.06044L4.20058 8.06044" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.5 10.4V18.6C6.5 19.4401 6.5 19.8601 6.65224 20.181C6.78292 20.4632 6.98677 20.6671 7.21895 20.7978C7.48486 20.95 7.84438 20.95 8.56342 20.95H15.4366C16.1556 20.95 16.5151 20.95 16.781 20.7978C17.0132 20.6671 17.2171 20.4632 17.3478 20.181C17.5 19.8601 17.5 19.4401 17.5 18.6V10.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9.5 14.15C9.5 13.7358 9.83579 13.4 10.25 13.4H13.75C14.1642 13.4 14.5 13.7358 14.5 14.15V18.1C14.5 18.5142 14.1642 18.85 13.75 18.85H10.25C9.83579 18.85 9.5 18.5142 9.5 18.1V14.15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Đang Phát Triển</h2>
                            <p className="text-center text-indigo-100 opacity-90">Chúng tôi đang xây dựng một trải nghiệm học tập tuyệt vời cho bạn</p>
                        </div>
                    </div>

                    {/* Right Content Side */}
                    <div className="md:w-3/5 bg-white dark:bg-gray-800 p-8 md:p-12">
                        <div className="flex items-center mb-6">
                            <div className="w-2 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-full mr-3"></div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
                                Khóa học đang được phát triển
                            </h1>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/40 rounded-xl p-5 mb-8 border-l-4 border-indigo-500 dark:border-indigo-400">
                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                Chúng tôi đang hoàn thiện nội dung khóa học này với những kiến thức chất lượng nhất. Vui lòng quay lại sau để không bỏ lỡ bất kỳ cập nhật thú vị nào!
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">Nội dung chất lượng cao</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">Cập nhật thường xuyên</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">Hỗ trợ từ giảng viên</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/"
                                className="flex-1 px-8 py-4 text-center text-lg font-medium bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:outline-none"
                            >
                                Trở về trang chủ
                            </Link>
                            <Link
                                href="/courses"
                                className="flex-1 px-8 py-4 text-center text-lg font-medium bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border-2 border-indigo-600 dark:border-indigo-500 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-600 transition-all transform hover:-translate-y-1 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:outline-none"
                            >
                                Xem khóa học khác
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-700 opacity-20 blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-teal-300 dark:from-blue-600 dark:to-teal-500 opacity-20 blur-2xl"></div>
            </div>
        );
    }

    const totalSecconsCourse = content?.lessonGroups?.reduce(
        (accumulator: number, currentGroup: any) => {
            currentGroup?.lectureDetail?.forEach((item: any) => {
                if (item?.lesson?.duration) {
                    accumulator += item?.lesson?.duration;
                }
            });
            return accumulator;
        },
        0
    );

    const totalLesson = content?.lessonGroups?.reduce(
        (accumulator: number, currentGroup: any) => {
            if (currentGroup?.lectureDetail?.length > 0) {
                accumulator += currentGroup?.lectureDetail?.length;
            }
            return accumulator;
        },
        0,
    );

    const fomartTimeCourse = convertSecondsToYMDHMS(totalSecconsCourse || 0);
    return (
        <div className="bg-gradient-to-b from-indigo-50/50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
            <div className="container mx-auto px-4 py-10">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-indigo-900/20 overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
                        <div className="col-span-1 lg:col-span-2 order-2 lg:order-1">
                            <Content
                                totalLesson={totalLesson}
                                timeCourse={fomartTimeCourse}
                                data={content}
                                courseId={id}
                            />
                        </div>
                        <div className="col-span-1 order-1 lg:order-2 sticky top-24 self-start">
                            <CourseInfo
                                totalLesson={totalLesson}
                                data={content}
                                timeCourse={fomartTimeCourse}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;