'use client'
import { useAppDispatch } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const LearningPathById = ({ initialData }: { initialData: any }) => {
    const dispatch = useAppDispatch();
    const [learningPath, setLearningPath] = useState<any>(null);
    const [steps, setSteps] = useState<any>(null);
    const [activeChapter, setActiveChapter] = useState<number | null>(null);
    const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
    console.log('init', initialData);

    useEffect(() => {
        dispatch(setStateNav(2));
        const fetchLearningPathDetail = async () => {
            try {
                if (initialData?.statusCode === 200) {
                    setLearningPath(initialData?.data?.learning_path);
                    // Mở rộng chương đầu tiên mặc định
                    if (initialData?.data?.steps?.length > 0) {
                        setSteps(initialData?.data?.steps)
                        setExpandedChapters([initialData?.data?.steps[0]?.id]);
                        setActiveChapter(initialData?.data?.steps[0]?.id);
                    }
                }
            } catch (error) {
                console.error('Error fetching learning path detail:', error);
            }
        };
        fetchLearningPathDetail();
    }, [dispatch, initialData]);

    const toggleChapter = (chapterId: number) => {
        setActiveChapter(chapterId);
        if (expandedChapters.includes(chapterId)) {
            setExpandedChapters(expandedChapters.filter(id => id !== chapterId));
        } else {
            setExpandedChapters([...expandedChapters, chapterId]);
        }
    };

    if (!learningPath) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }
    console.log('step', steps);

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-70"></div>
                <div className="container mx-auto px-4 py-16 relative">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="w-full md:w-1/2">
                            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                Lộ trình học
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                {learningPath.title}
                            </h1>
                            <p className="text-2xl text-gray-600 leading-relaxed mb-8 text-justify">
                                {learningPath.description}
                            </p>
                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                                    <svg className="w-8 h-8 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-700 text-2xl">{learningPath.duration} phút</span>
                                </div>
                                <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                                    <svg className="w-8 h-8 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span className="text-gray-700 text-2xl">{learningPath.course_count} khóa học</span>
                                </div>
                                <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                                    <svg className="w-8 h-8 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-gray-700 text-2xl">{learningPath.total_students || 0} học viên</span>
                                </div>
                            </div>
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-2xl font-medium text-gray-600">Tiến độ học tập</span>
                                    <span className="text-2xl font-medium text-purple-600">{Math.round((learningPath.totalUserRegigter / learningPath.course_count) * 100) || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.round((learningPath.totalUserRegigter / learningPath.course_count) * 100) || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={learningPath.image || ''}
                                    alt={learningPath.title}
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Chapters Section */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold mb-12 text-center">Nội dung lộ trình học</h2>

                <div className="max-w-screen-xl mx-auto">
                    {/* Timeline */}
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        {/* Chapters */}
                        {steps?.map((chapter: any, index: number) => (
                            <div key={chapter.id} className="mb-12 relative">
                                {/* Chapter header */}
                                <div
                                    className={`flex items-center cursor-pointer ${activeChapter === chapter.id ? 'text-purple-600' : 'text-gray-800'}`}
                                    onClick={() => toggleChapter(chapter.id)}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-6 z-10 ${activeChapter === chapter.id
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-white border-2 border-gray-300 text-gray-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-bold">{chapter.title}</h3>
                                        <p className="text-gray-600 mt-1 text-xl py-2">{chapter.description}</p>
                                    </div>
                                    <div className="ml-4">
                                        <svg
                                            className={`w-6 h-6 transition-transform duration-300 ${expandedChapters.includes(chapter.id) ? 'transform rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Chapter content */}
                                {expandedChapters.includes(chapter.id) && (
                                    <div className="ml-24 mt-6 space-y-4">
                                        {chapter.courses?.map((course: any) => (
                                            <div
                                                key={course?.id}
                                                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center">
                                                    <div className="w-full md:w-1/4 mb-4 md:mb-0">
                                                        <div className="relative lg:h-52 rounded-lg md:h-24">
                                                            <img
                                                                src={course?.banner || '/placeholder-course.jpg'}
                                                                alt={course?.title}
                                                                className="w-full h-full rounded-2xl object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 md:ml-6">
                                                        <h4 className="text-3xl font-semibold mb-2">{course?.title}</h4>
                                                        <p className="text-gray-600 mb-4 text-xl">{course.details?.totalUserRegigter}</p>
                                                        <div className="flex flex-wrap gap-4 text-xl text-gray-500">
                                                            <div className="flex items-center">
                                                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {course?.duration} phút
                                                            </div>
                                                            <div className="flex items-center">
                                                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {course.lesson_counts} bài học
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 md:mt-0 md:ml-6">
                                                        <Link
                                                            href={`/courses/${course.id}`}
                                                            className="inline-flex items-center justify-center px-6 py-4 text-xl font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-300"
                                                        >
                                                            Xem chi tiết
                                                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Student Count Section */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-6 md:mb-0">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Tổng số người học lộ trình này</h2>
                            <p className="text-xl text-gray-600">Tham gia cùng với cộng đồng học viên đang theo đuổi lộ trình này</p>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-purple-100 rounded-full p-4 mr-4">
                                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-5xl font-bold text-purple-600 text-center">{learningPath.total_students || 0}</div>
                                <div className="text-xl text-gray-600">học viên</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-12 text-center">Câu hỏi thường gặp</h2>
                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-2xl font-semibold mb-3">Lộ trình học này phù hợp với ai?</h3>
                                <p className="text-gray-600">Lộ trình này phù hợp với những người mới bắt đầu học lập trình và muốn có một hướng đi rõ ràng, có hệ thống. Bạn sẽ được hướng dẫn từ cơ bản đến nâng cao.</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-2xl font-semibold mb-3">Tôi cần bao nhiêu thời gian để hoàn thành?</h3>
                                <p className="text-gray-600">Thời gian hoàn thành phụ thuộc vào tốc độ học của bạn. Trung bình, học viên mất khoảng {Math.ceil(learningPath.courseTime / 60)} giờ để hoàn thành toàn bộ lộ trình.</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-2xl font-semibold mb-3">Tôi có nhận được chứng chỉ khi hoàn thành không?</h3>
                                <p className="text-gray-600">Có, bạn sẽ nhận được chứng chỉ hoàn thành khi hoàn thành tất cả các khóa học trong lộ trình. Chứng chỉ này có thể được sử dụng để chứng minh kỹ năng của bạn với nhà tuyển dụng.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}

export default LearningPathById