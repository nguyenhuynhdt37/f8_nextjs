import { DeleteCourse } from '@/api/axios/api';
import { message, Modal } from 'antd';
import React, { useState } from 'react';

interface DeleteProps {
  setLoadData: (value: React.SetStateAction<number>) => void;
  setShowDelete: (value: boolean) => void;
  id: number;
}

const Delete: React.FC<DeleteProps> = ({ setLoadData, setShowDelete, id }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleDeleteCourse = async (id: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (id === -1) return;

    setIsDeleting(true);
    try {
      const res = await DeleteCourse({ id });

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        messageApi.success('Xóa khóa học thành công!');
        setLoadData((prev: number) => prev + 1);
        setShowDelete(false);
      } else if (res?.statusCode === 400 || res?.statusCode === 401) {
        messageApi.error('Khóa học không tồn tại!');
      } else if (res?.statusCode === 409) {
        messageApi.error('Khóa học tồn tại dữ liệu không thể xóa bỏ!');
      } else {
        messageApi.error(res?.message || 'Có lỗi trong quá trình thực hiện!');
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      messageApi.error('Có lỗi trong quá trình thực hiện!');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4">
      {contextHolder}
      <div className="flex justify-center mb-4">
        <img src="/images/delete.png" className="w-32 h-32 object-contain" alt="Delete confirmation" />
      </div>
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Xóa khóa học
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Bạn có chắc chắn muốn xóa khóa học này? Thao tác này không thể hoàn tác.
        </p>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowDelete(false)}
          disabled={isDeleting}
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          onClick={(e) => handleDeleteCourse(id, e)}
          disabled={isDeleting}
          className={`flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isDeleting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xóa...
            </>
          ) : 'Xóa khóa học'}
        </button>
      </div>
    </div>
  );
};

export default Delete;
