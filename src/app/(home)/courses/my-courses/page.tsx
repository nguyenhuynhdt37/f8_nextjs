import { Metadata } from 'next';
import MyCoursesClient from '@/components/client/Courses/MyCoursesClient';
import { useCookie } from '@/hook/useCookie';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Khóa học của tôi | F8',
  description: 'Các khóa học bạn đã đăng ký tại F8',
  openGraph: {
    title: 'Khóa học của tôi - F8',
    description: 'Theo dõi và tiếp tục học tập với các khóa học bạn đã đăng ký tại F8',
    images: ['https://fullstack.edu.vn/assets/icon/f8_icon.png'],
  },
};

export default async function MyCoursesPage() {
  const cookieHeader = useCookie();

  // Initial fetch with default parameters
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/my-courses?pageNumber=1&pageSize=12&sortField=EnrolledAt&sortOrder=desc`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        cache: 'no-store',
      }
    );

    // Handle unauthorized access
    if (response.status === 401) {
      redirect('/auth');
    }

    // Handle other errors
    if (!response.ok) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Không thể tải khóa học</h2>
            <p className="text-gray-600 mb-6">
              Đã xảy ra lỗi khi tải danh sách khóa học của bạn. Vui lòng thử lại sau.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Thử lại
            </button>
          </div>
        </div>
      );
    }

    const data = await response.json();

    // Pass initial data to client component
    return <MyCoursesClient initialData={data.data} />;

  } catch (error) {
    console.error('Error fetching courses:', error);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Không thể kết nối đến máy chủ</h2>
          <p className="text-gray-600 mb-6">
            Đã xảy ra lỗi khi kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }
}
