import { DeleteLessonGroup } from '@/api/axios/api';
import React from 'react';
import { toast } from 'sonner';

const Delete = ({ setLoadData, setShowDelete, id }: any) => {
  const handleDelete = async (id: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (id === -1) return;

    try {
      const res = await DeleteLessonGroup({ id });

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        toast.success('Xóa chương thành công!');
        setLoadData((prev: number) => prev + 1);
        setShowDelete(false);
      } else if (res?.statusCode === 400 || res?.statusCode === 401) {
        toast.error('Chương học không tồn tại!');
      } else if (res?.statusCode === 409) {
        toast.error('Chương học tồn tại dữ liệu không thể xóa bỏ!');
      } else {
        toast.error('Có lỗi trong quá trình thực hiện!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa chương!');
    }

    setShowDelete(false);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-red-600 dark:text-red-400">
            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Xác nhận xóa chương
        </h3>

        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
          Bạn có chắc chắn muốn xóa chương học này? Hành động này không thể hoàn tác và tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => setShowDelete(false)}
            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-150"
          >
            Hủy bỏ
          </button>
          <button
            onClick={(e) => handleDelete(id, e)}
            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-150"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
