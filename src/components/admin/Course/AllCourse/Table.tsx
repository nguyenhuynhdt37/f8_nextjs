import React, { useRef, useState } from 'react';
// import Pagination from '../../Pagination';
import { message, Modal, Switch, Badge, Tag, Tooltip, Spin } from 'antd';
import Delete from './Delete';
import { CourseActive } from '@/api/axios/api';
import LoadingBar from 'react-top-loading-bar';
import { useOutsideClick } from '@/hook/useOutsideClick';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { timeAgo } from '@/Utils/functions';


interface CourseItem {
  course: {
    id: number;
    title: string;
    banner: string;
    introduce: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    details: {
      price: number;
      priceOld: number;
      isFree: boolean;
    };
    userCourseCounts: number;
    lessonCount: number;
    totalDuration: number;
  };
  level: {
    id: number;
    name: string;
  };
}

interface TableProps {
  data: CourseItem[];
  loading: boolean;
  setLoadData: (value: React.SetStateAction<number>) => void;
}

const Table: React.FC<TableProps> = ({ data, loading, setLoadData }) => {
  const ref = useRef<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const router = useRouter();
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [idDelete, setIdDelete] = useState<number>(-1);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const handleDelete = (id: number) => {
    setIdDelete(id);
    setShowDelete(true);
  };

  const handleChecked = async (id: number, isActive: boolean) => {
    setActionLoading(true);
    ref.current.continuousStart();
    try {
      const res = await CourseActive({ courseId: id, isActive });
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        setLoadData((prev: number) => prev + 1);
        messageApi.success('Đã cập nhật trạng thái khóa học');
      } else {
        messageApi.error('Có lỗi xảy ra khi thay đổi trạng thái');
      }
    } catch (error) {
      messageApi.error('Có lỗi xảy ra khi thay đổi trạng thái');
    } finally {
      ref.current.complete();
      setActionLoading(false);
    }
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const menuRef = useOutsideClick(handleCloseMenu);

  const handleToggleMenu = (id: number) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const handleEdit = (id: number) => {
    ref.current.continuousStart();
    router?.push(`/admin/course/edit/${id}`);
  };

  const handleRedirectChapter = (id: number) => {
    ref.current.continuousStart();
    router?.push(`/admin/course/chapter/${id}`);
  };

  const handleRedirectLesson = (id: number) => {
    ref.current.continuousStart();
    router?.push(`/admin/course/lesson/${id}`);
  };

  const handleRedirectSort = (id: number) => {
    ref.current.continuousStart();
    router?.push(`/admin/course/sort/${id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex justify-center items-center min-h-[300px]">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Không có khóa học nào</h3>
          <p className="text-gray-500 dark:text-gray-400">Hãy thêm khóa học mới hoặc thay đổi bộ lọc tìm kiếm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {contextHolder}
      <LoadingBar color="#0066df" ref={ref} />
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tên khóa học
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cấp độ
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Giá
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Chức năng
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item: CourseItem) => (
                <tr key={item.course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.course.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24 h-16 rounded-lg overflow-hidden relative">
                      {item.course.banner ? (
                        <img
                          src={item.course.banner}
                          alt={item.course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                      {item.course.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {item.course.lessonCount} bài học
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Tag color={item.level.id === 1 ? "blue" : "purple"}>
                      {item.level.name}
                    </Tag>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.course.details.isFree ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">Miễn phí</span>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatPrice(item.course.details.price)}
                        </div>
                        {item.course.details.priceOld > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(item.course.details.priceOld)}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {timeAgo(item.course.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Switch
                      checked={item.course.isActive}
                      onChange={() => handleChecked(item.course.id, !item.course.isActive)}
                      loading={actionLoading}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Tooltip title="Chỉnh sửa">
                        <button
                          onClick={() => handleEdit(item.course.id)}
                          className="p-2 rounded-full bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </Tooltip>

                      <Tooltip title="Xóa">
                        <button
                          onClick={() => handleDelete(item.course.id)}
                          className="p-2 rounded-full bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </Tooltip>

                      <div className="relative">
                        <Tooltip title="Thêm tùy chọn">
                          <button
                            onClick={() => handleToggleMenu(item.course.id)}
                            className="p-2 rounded-full bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </Tooltip>

                        {openMenu === item.course.id && (
                          <div
                            ref={menuRef}
                            className="absolute z-10 right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1"
                          >
                            <button
                              onClick={() => handleRedirectChapter(item.course.id)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              Quản lý chương
                            </button>
                            <button
                              onClick={() => handleRedirectLesson(item.course.id)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Quản lý bài học
                            </button>
                            <button
                              onClick={() => handleRedirectSort(item.course.id)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                              </svg>
                              Sắp xếp chương và bài học
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title={null}
        footer={null}
        onCancel={() => setShowDelete(false)}
        open={showDelete}
      >
        <Delete
          setLoadData={setLoadData}
          setShowDelete={setShowDelete}
          id={idDelete}
        />
      </Modal>
    </div>
  );
};

export default Table;
