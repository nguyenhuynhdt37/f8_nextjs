import React, { useRef, useState } from 'react';
import Pagination from '../../Pagination';
import { message, Modal, Tooltip, Empty } from 'antd';
import Delete from './Delete';
import { CourseActive } from '@/api/axios/api';
import LoadingBar from 'react-top-loading-bar';
import { useOutsideClick } from '@/hook/useOutsideClick';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { formatDate } from '@/Utils/functions';

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
        setLoadData((prev: number) => prev + 1);
        messageApi.success('Cập nhật trạng thái thành công');
      } else {
        messageApi.error('Có lỗi xảy ra khi thay đổi trạng thái');
      }
    } catch (error) {
      messageApi.error('Có lỗi xảy ra khi thay đổi trạng thái');
    } finally {
      ref.current.complete();
    }
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const menuRef = useOutsideClick(handleCloseMenu);

  const handleEdit = (id: number) => {
    ref.current.continuousStart();
    router.push(`/admin/course/chapter/edit/${id}`);
  };

  const handleViewLessons = (id: number) => {
    ref.current.continuousStart();
    router.push(`/admin/course/lesson/${id}`);
  };

  return (
    <div>
      {contextHolder}
      <LoadingBar color="#4f46e5" ref={ref} height={2} />

      {!data?.data?.length ? (
        <Empty
          description="Không có dữ liệu chương học"
          className="py-6"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="px-2 py-1.5">ID</th>
                <th className="px-2 py-1.5">Tên chương</th>
                <th className="px-2 py-1.5">Ngày tạo</th>
                <th className="px-2 py-1.5">Ngày cập nhật</th>
                <th className="px-2 py-1.5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data?.data?.map((chapter: any, index: number) => (
                <tr
                  key={chapter?.id || index}
                  className="bg-white hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 py-1.5 font-medium text-gray-900">
                    {chapter?.id}
                  </td>
                  <td className="px-2 py-1.5 font-medium">
                    {chapter?.name}
                  </td>
                  <td className="px-2 py-1.5 text-gray-500">
                    {formatDate(chapter?.createdAt)}
                  </td>
                  <td className="px-2 py-1.5 text-gray-500">
                    {formatDate(chapter?.updatedAt)}
                  </td>
                  <td className="px-2 py-1.5">
                    <div className="flex items-center justify-center space-x-1">
                      <Tooltip title="Xem bài học">
                        <button
                          onClick={() => handleViewLessons(chapter?.id)}
                          className="p-0.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <FiEye size={12} />
                        </button>
                      </Tooltip>

                      <Tooltip title="Chỉnh sửa">
                        <button
                          onClick={() => handleEdit(chapter?.id)}
                          className="p-0.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        >
                          <FiEdit2 size={12} />
                        </button>
                      </Tooltip>

                      <Tooltip title="Xóa">
                        <button
                          onClick={() => handleDelete(chapter?.id)}
                          className="p-0.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-2 border-t border-gray-100">
            <Pagination
              pageEdit={params}
              setLoadData={setLoadData}
              setPageEdit={setParams}
            />
          </div>
        </div>
      )}

      <Modal
        title="Xác nhận xóa chương học"
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
