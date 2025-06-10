import React, { useRef, useState } from 'react';
import Delete from './Delete';
import { CourseActive } from '@/api/axios/api';
import LoadingBar from 'react-top-loading-bar';
import { useOutsideClick } from '@/hook/useOutsideClick';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const Table = ({ data, params, setParams, setLoadData }: any) => {
  const ref = useRef<any>(null);
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
    const res = await CourseActive({ courseId: id, isActive });
    ref.current.complete();
    if (res?.statusCode === 200 || res?.statusCode === 201) {
      setLoadData((prev: number) => (prev += 1));
      toast.success('Cập nhật trạng thái thành công');
    } else {
      toast.error('Có lỗi xẩy ra khi thay đổi');
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
    router.push(`/admin/course/chapter/edit/${id}`);
  };

  return (
    <div className="flex flex-col pt-6">
      <LoadingBar color="#0066df" ref={ref} />
      <div className="overflow-x-auto pb-4">
        <div className="rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {/* Table header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Danh sách chương</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quản lý các chương trong khóa học</p>
          </div>

          {/* Table content */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs font-medium tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Tên chương</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4">Ngày cập nhật</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data?.data?.map((course: any, index: number) => (
                  <tr
                    key={course?.id || index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {course?.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {course?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {course?.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {course?.updatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(course?.id)}
                          className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors duration-150"
                          aria-label="Chỉnh sửa"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(course?.id)}
                          className="p-2 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-150"
                          aria-label="Xóa"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty state */}
            {!data?.data?.length && (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">Không có dữ liệu</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  Hiện tại chưa có chương nào được tạo. Bạn có thể tạo chương mới để bắt đầu.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
              onClick={() => setShowDelete(false)}
            ></div>

            {/* Dialog */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <Delete
                setLoadData={setLoadData}
                setShowDelete={setShowDelete}
                id={idDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
