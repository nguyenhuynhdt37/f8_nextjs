import React, { useRef, useState } from 'react';
import Pagination from '../../Pagination';
import { message, Modal, Switch, Dropdown, Menu, Tooltip } from 'antd';
import Delete from './Delete';
import { CourseActive } from '@/api/axios/api';
import LoadingBar from 'react-top-loading-bar';
import { FiMoreVertical, FiEdit2, FiTrash2, FiLayers, FiBookOpen, FiList } from 'react-icons/fi';
import { useOutsideClick } from '@/hook/useOutsideClick';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { timeAgo } from '@/Utils/functions';

const Table = ({ data, params, setParams, setLoadData }: any) => {
  const ref = useRef<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const router = useRouter();
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [idDelete, setIdDelete] = useState<number>(-1);

  const handleDelete = (id: number) => {
    setIdDelete(id);
    setShowDelete(true);
  };

  const handleChecked = async (id: number, isActive: boolean) => {
    ref.current.continuousStart();
    try {
      const res = await CourseActive({ courseId: id, isActive });
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        messageApi.success(isActive ? 'Kích hoạt khóa học thành công' : 'Đã hủy kích hoạt khóa học');
        setLoadData((prev: number) => (prev += 1));
      } else {
        messageApi.error('Có lỗi xảy ra khi thay đổi trạng thái khóa học');
      }
    } catch (error) {
      messageApi.error('Có lỗi xảy ra khi thay đổi trạng thái khóa học');
    } finally {
      ref.current.complete();
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
    router?.push('course/edit/' + id);
  };

  const handleRedirectChapter = (id: number) => {
    ref.current.continuousStart();
    router?.push('course/chapter/' + id);
  };

  const handleRedirectLesson = (id: number) => {
    ref.current.continuousStart();
    router?.push('course/lesson/' + id);
  };

  const handleRedirectSort = (id: number) => {
    ref.current.continuousStart();
    router?.push('course/sort/' + id);
  };

  return (
    <div className="flex flex-col">
      {contextHolder}
      <LoadingBar color="#4f46e5" ref={ref} height={2} />

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[10px] uppercase bg-gray-50 text-gray-500">
            <tr>
              <th className="px-2 py-1.5 font-medium tracking-wider">ID</th>
              <th className="px-2 py-1.5 font-medium tracking-wider">Hình ảnh</th>
              <th className="px-2 py-1.5 font-medium tracking-wider">Tên khóa học</th>
              <th className="px-2 py-1.5 font-medium tracking-wider">Ngày tạo</th>
              <th className="px-2 py-1.5 font-medium tracking-wider">Trạng thái</th>
              <th className="px-2 py-1.5 font-medium tracking-wider text-right">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data?.data?.map((course: any) => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 py-1.5 whitespace-nowrap font-medium text-gray-900">
                  #{course?.id}
                </td>

                <td className="px-2 py-1.5">
                  <div className="h-12 w-20 rounded-md overflow-hidden bg-gray-100">
                    {course?.banner ? (
                      <img
                        src={course?.banner}
                        alt={course?.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                        <FiLayers className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-2 py-1.5">
                  <div className="font-medium text-gray-900">{course?.title}</div>
                </td>

                <td className="px-2 py-1.5 whitespace-nowrap text-gray-500">
                  {timeAgo(course?.createdAt)}
                </td>

                <td className="px-2 py-1.5 whitespace-nowrap">
                  <Switch
                    size="small"
                    checked={course?.isActive}
                    onChange={() => handleChecked(course?.id, !course?.isActive)}
                    className={course?.isActive ? "bg-green-500" : "bg-gray-200"}
                  />
                </td>

                <td className="px-2 py-1.5 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Tooltip title="Chỉnh sửa">
                      <button
                        onClick={() => handleEdit(course?.id)}
                        className="p-0.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                      >
                        <FiEdit2 size={12} />
                      </button>
                    </Tooltip>

                    <Tooltip title="Xóa">
                      <button
                        onClick={() => handleDelete(course?.id)}
                        className="p-0.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </Tooltip>

                    <div className="relative">
                      <Tooltip title="Thêm tùy chọn">
                        <button
                          onClick={() => handleToggleMenu(course?.id)}
                          className="p-0.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        >
                          <FiMoreVertical size={12} />
                        </button>
                      </Tooltip>

                      {openMenu === course?.id && (
                        <div
                          ref={menuRef}
                          className="absolute z-10 right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg text-[10px]"
                        >
                          <div className="py-1">
                            <button
                              onClick={() => handleRedirectChapter(course?.id)}
                              className="flex w-full items-center px-2 py-1.5 text-[10px] text-gray-700 hover:bg-gray-50"
                            >
                              <FiLayers className="mr-1.5 text-gray-500" size={10} />
                              Quản lý chương
                            </button>

                            <button
                              onClick={() => handleRedirectLesson(course?.id)}
                              className="flex w-full items-center px-2 py-1.5 text-[10px] text-gray-700 hover:bg-gray-50"
                            >
                              <FiBookOpen className="mr-1.5 text-gray-500" size={10} />
                              Quản lý bài học
                            </button>

                            <button
                              onClick={() => handleRedirectSort(course?.id)}
                              className="flex w-full items-center px-2 py-1.5 text-[10px] text-gray-700 hover:bg-gray-50"
                            >
                              <FiList className="mr-1.5 text-gray-500" size={10} />
                              Sắp xếp chương và bài học
                            </button>
                          </div>
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

      {!data?.data?.length && (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50">
          <div className="text-gray-400 mb-1.5">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 className="text-xs font-medium text-gray-900">Không có khóa học nào</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Bạn có thể thêm khóa học mới bằng nút "Thêm khóa học"</p>
        </div>
      )}

      <div className="border-t border-gray-100 p-2">
        <Pagination
          pageEdit={params}
          setLoadData={setLoadData}
          setPageEdit={setParams}
        />
      </div>

      <Modal
        title="Xác nhận xóa khóa học"
        footer={null}
        onCancel={() => setShowDelete(false)}
        open={showDelete}
      >
        <Delete id={idDelete} setShowDelete={setShowDelete} setLoadData={setLoadData} />
      </Modal>
    </div>
  );
};

export default Table;
