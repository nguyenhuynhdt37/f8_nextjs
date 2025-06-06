'use server';
import React from 'react';
import {
  FiEdit2, FiMail, FiGlobe, FiGithub, FiYoutube, FiFacebook,
  FiUser, FiCheckCircle, FiXCircle, FiCalendar, FiClock,
  FiArrowLeft, FiPhone, FiShield, FiBookOpen, FiHeart, FiBox
} from 'react-icons/fi';
import { Breadcrumbs } from '@/components/admin/MainContent/Breadcrumbs';
import { redirect } from 'next/navigation';
import { getUserByID } from '@/api/axios/api';
import { cookies } from 'next/headers';
import Link from 'next/link';

const breadcrumbItems = [
  { title: 'Trang chủ', link: '/admin' },
  { title: 'Người dùng', link: '/admin/users' },
  { title: 'Chi tiết người dùng', link: '/admin/details' },
];

interface CoursePageProps {
  params: { id: string };
}

const DetailPage = async (context: CoursePageProps) => {
  const { id } = (await context.params) || {};
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  if (!id) redirect('/404');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${id}`,
    {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    },
  );

  if (!res.ok) redirect('/404');

  const { data } = await res?.json();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/users" className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FiArrowLeft className="text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Chi tiết người dùng</h1>
              <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                ID: #{id}
              </span>
            </div>
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={`/admin/users/edit/${id}`} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            <FiEdit2 className="mr-2" />
            Chỉnh sửa
          </Link>
        </div>
      </div>

      <div className="p-6">
        {/* Hero section with cover and avatar */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
          </div>

          <div className="px-6 relative">
            <div className="flex flex-col md:flex-row md:items-end">
              <div className="-mt-16 relative">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-md">
                  {data?.avatar ? (
                    <img
                      src={data.avatar}
                      alt={data?.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                      <FiUser size={40} />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0 md:ml-6 md:pb-5">
                <h1 className="text-2xl font-bold text-gray-900">{data?.fullName}</h1>
                <div className="flex flex-wrap items-center mt-1 gap-3">
                  <span className="flex items-center text-gray-600 text-sm">
                    <FiMail className="mr-1" /> {data?.email}
                  </span>

                  {data?.phoneNumber && (
                    <>
                      <span className="text-gray-300 hidden md:inline">•</span>
                      <span className="flex items-center text-gray-600 text-sm">
                        <FiPhone className="mr-1" /> {data?.phoneNumber}
                      </span>
                    </>
                  )}

                  <span className="text-gray-300 hidden md:inline">•</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {data?.role === 'admin' ? (
                      <>
                        <FiShield className="mr-1 text-blue-500" />
                        Quản trị viên
                      </>
                    ) : (
                      <>
                        <FiUser className="mr-1 text-blue-500" />
                        Người dùng
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center text-gray-700">
                <div className={`flex items-center px-3 py-1 rounded-full text-sm ${data?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {data?.isActive ? (
                    <>
                      <FiCheckCircle className="mr-1.5" />
                      Đã kích hoạt
                    </>
                  ) : (
                    <>
                      <FiXCircle className="mr-1.5" />
                      Chưa kích hoạt
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <FiCalendar className="mr-2 text-gray-400" />
                <span className="text-sm">Tham gia: {formatDate(data?.createdAt)}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <FiClock className="mr-2 text-gray-400" />
                <span className="text-sm">Cập nhật: {formatDate(data?.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left column - Contact info & stats */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiBox className="mr-2 text-indigo-500" />
                Thống kê
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full text-indigo-600 mx-auto mb-3">
                    <FiBookOpen />
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-indigo-700">0</span>
                    <span className="text-xs text-gray-500">Khóa học</span>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full text-purple-600 mx-auto mb-3">
                    <FiHeart />
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-purple-700">0</span>
                    <span className="text-xs text-gray-500">Bài viết đã lưu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiUser className="mr-2 text-indigo-500" />
                Thông tin liên hệ
              </h2>

              <div className="space-y-4">
                {data?.githubLink && (
                  <a href={data.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                      <FiGithub />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">GitHub</h3>
                      <p className="text-sm text-gray-500 truncate">{data.githubLink}</p>
                    </div>
                  </a>
                )}

                {data?.facebookLink && (
                  <a href={data.facebookLink} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <FiFacebook />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">Facebook</h3>
                      <p className="text-sm text-gray-500 truncate">{data.facebookLink}</p>
                    </div>
                  </a>
                )}

                {data?.youtubeLink && (
                  <a href={data.youtubeLink} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                      <FiYoutube />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">YouTube</h3>
                      <p className="text-sm text-gray-500 truncate">{data.youtubeLink}</p>
                    </div>
                  </a>
                )}

                {data?.personalWebsite && (
                  <a href={data.personalWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                      <FiGlobe />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">Website</h3>
                      <p className="text-sm text-gray-500 truncate">{data.personalWebsite}</p>
                    </div>
                  </a>
                )}

                {!data?.githubLink && !data?.facebookLink && !data?.youtubeLink && !data?.personalWebsite && (
                  <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                    <p>Chưa có thông tin liên hệ</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Bio and courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiUser className="mr-2 text-indigo-500" />
                Giới thiệu
              </h2>

              {data?.bio ? (
                <div
                  className="prose prose-indigo max-w-none text-gray-700 [&>p]:text-gray-700 [&>ul]:text-gray-700 [&>ol]:text-gray-700 [&>h1]:text-gray-900 [&>h2]:text-gray-800 [&>h3]:text-gray-800 [&>h4]:text-gray-800 [&>h5]:text-gray-800 [&>h6]:text-gray-800 [&>a]:text-indigo-600 [&>blockquote]:text-gray-700 [&>code]:text-gray-800 [&>pre]:bg-gray-100"
                  dangerouslySetInnerHTML={{ __html: data.bio }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <p>Người dùng chưa cập nhật thông tin giới thiệu</p>
                </div>
              )}
            </div>

            {/* Courses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiBookOpen className="mr-2 text-indigo-500" />
                Khóa học đã đăng ký
              </h2>

              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
                  <FiBookOpen size={24} />
                </div>
                <p>Chưa có thông tin về khóa học đã đăng ký</p>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiClock className="mr-2 text-indigo-500" />
                Hoạt động gần đây
              </h2>

              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-3">
                  <FiClock size={24} />
                </div>
                <p>Chưa có hoạt động gần đây</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
