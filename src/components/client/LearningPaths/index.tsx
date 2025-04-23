'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStudySechedule } from '@/api/axios/api';
import Login from '../Login';


const LearningPaths = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector(state => state.auth?.user);

  const [studySechedule, setStudySechedule] = useState<any>([]);
  useEffect(() => {
    dispatch(setStateNav(2));
    const handleGetStudys = async () => {
      setIsLoading(true)
      const res = await getStudySechedule();
      if (res?.statusCode === 200) {
        setStudySechedule(res?.data)
      }
      setIsLoading(false)
    }

    if (studySechedule?.length <= 0) {
      handleGetStudys()
    }
  }, [user]);

  return (
    <div className="min-h-screen relative  bg-white text-black">

      {/* Hero Section */}
      <div className=" overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-70"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>

        {/* Decorative Elements */}


        <div className="container mx-auto px-4 py-24 relative">
          <div className="">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              Khám phá lộ trình học
            </div>
            <h1 className="text-7xl md:text-8xl font-bold mb-6 pb-10 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Lộ trình học
            </h1>
            {!user && !isLoading ? (
              <div className="mb-10">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-20 shadow-lg border border-purple-100 flex flex-col items-center justify-center text-center w-full">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl py-2 font-bold text-gray-800 mb-2">Bạn chưa đăng nhập</h3>
                  <p className="text-gray-600 mb-4 text-xl max-w-md">Đăng nhập để xem lộ trình học và theo dõi tiến độ của bạn.</p>
                  <button onClick={() => setOpenLogin(true)} className="px-10 py-3 text-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg">
                    Đăng nhập ngay
                  </button>
                </div>
              </div>
            ) : null}
            <p className="text-2xl md:text-3xl text-gray-600 leading-relaxed mb-10">
              Chọn lộ trình học phù hợp với mục tiêu của bạn. Mỗi lộ trình được thiết kế để giúp bạn thành thạo các kỹ năng cần thiết.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Học theo tốc độ của bạn</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Chứng chỉ hoàn thành</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                <svg className="w-5 h-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-gray-700">Cộng đồng hỗ trợ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!user ? null : (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {studySechedule?.map((item: any, index: number) => (
              <div
                key={item.learningPath?.id || index}
                className="relative bg-gradient-to-br bg-[#efefef] border-[0.1rem] border-[#f1f1f1] rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-1"
              >
                <div className="relative h-80">
                  <img
                    src={item?.learningPath?.image || ''}
                    alt={item?.learningPath?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">{item?.learningPath?.title}</h3>
                    <div className="flex items-center space-x-8 text-white text-lg">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {item?.courseTime} phút
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                        {item?.courseItems} khóa học
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        {item?.courseUserRegiterCount || 0} học viên
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-medium text-gray-600">Tiến độ học tập</span>
                      <span className="text-xl font-medium text-purple-600">{Math.round((item?.registeredCourses / item?.courseItems) * 100) || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.round((item?.registeredCourses / item?.courseItems) * 100) || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link
                    href={`/learning-paths/${item?.learningPath?.id}`}
                    className="inline-flex items-center justify-center w-full px-6 py-4 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:-translate-y-1"
                  >
                    {item?.registeredCourses === 0 ? 'Bắt đầu học' : 'Xem chi tiết'}
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[1.6rem] relative justify-between py-32 flex z-50 items-center">
            <div className='pe-20 max-w-2xl'>
              <h2 className="text-5xl mb-8 font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Tham gia cộng đồng học viên F8 trên Facebook</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-10">Hàng nghìn người khác đang học lộ trình giống như bạn. Hãy tham gia hỏi đáp, chia sẻ và hỗ trợ nhau trong quá trình học nhé.</p>
              <a
                target='_blank'
                href="https://www.facebook.com/groups/f8official"
                className="inline-block"
              >
                <button className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-1 flex items-center'>
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Tham gia nhóm
                </button>
              </a>
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <img
                className='w-[500px] rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-500'
                src="https://fullstack.edu.vn/assets/fb-group-cards-CAn_kGMe.png"
                alt="Cộng đồng F8 trên Facebook"
              />
            </div>
          </div>
        </div>
      )}
      <Login open={openLogin} setOpen={setOpenLogin} />
    </div>
  );
};

export default LearningPaths;
