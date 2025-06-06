import { IUser } from '@/types/next-auth';
import { Modal, Tooltip, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FiMoreVertical, FiEye, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiUser, FiShield } from 'react-icons/fi';
import LoadingBar from 'react-top-loading-bar';
import Image from 'next/image';

interface TableProps {
  data: IUser[] | undefined;
  onDelete: (id: number) => Promise<void>;
  onToggleStatus: (id: number, isActive: number) => Promise<void>;
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
}

const Table: React.FC<TableProps> = ({
  data,
  onDelete,
  onToggleStatus,
  selectedItems,
  setSelectedItems
}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<number>(-1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number>(-1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const ref = useRef<any>(null);

  const handleMore = (event: React.MouseEvent, id: number) => {
    event.preventDefault();
    event.stopPropagation();
    setShowModal(id);
    if (id === showModal) {
      setShowModal(-1);
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef]);

  const handleEdit = (event: React.MouseEvent, id: number) => {
    event.preventDefault();
    event.stopPropagation();
    ref.current.continuousStart();
    router.push(`/admin/users/edit/${id}`);
  };

  const handleRedirectDetail = (id: number) => {
    ref.current.continuousStart();
    router.push(`/admin/users/details/${id}`);
  };

  const handleConfirmDelete = (event: React.MouseEvent, id: number) => {
    event.preventDefault();
    event.stopPropagation();
    setConfirmDeleteId(id);
    setShowDeleteConfirm(true);
    setShowModal(-1);
  };

  const handleDelete = async () => {
    if (confirmDeleteId > 0) {
      await onDelete(confirmDeleteId);
      setShowDeleteConfirm(false);
      setConfirmDeleteId(-1);
    }
  };

  const handleToggleStatus = async (event: React.MouseEvent, id: number, isActive: number) => {
    event.preventDefault();
    event.stopPropagation();
    await onToggleStatus(id, isActive);
    setShowModal(-1);
  };

  const handleSelectItem = (e: CheckboxChangeEvent, id: number) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleSelectAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked && data) {
      const allIds = data.map(user => Number(user.id));
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const isAllSelected = data?.length ? data.every(user => selectedItems.includes(Number(user.id))) : false;
  const isIndeterminate = selectedItems.length > 0 && data?.length ? !isAllSelected : false;

  return (
    <>
      <LoadingBar color="#4f46e5" ref={ref} height={3} />
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-4 font-medium tracking-wider">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-4 font-medium tracking-wider">ID</th>
              <th className="px-4 py-4 font-medium tracking-wider">Thông tin</th>
              <th className="px-4 py-4 font-medium tracking-wider">Vai trò</th>
              <th className="px-4 py-4 font-medium tracking-wider">Trạng thái</th>
              <th className="px-4 py-4 font-medium tracking-wider text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.map(item => (
              <tr
                key={item?.id}
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedItems.includes(Number(item.id)) ? 'bg-indigo-50' : ''
                  }`}
                onClick={() => handleRedirectDetail(+item?.id)}
              >
                <td className="px-4 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedItems.includes(Number(item.id))}
                    onChange={(e) => handleSelectItem(e, Number(item.id))}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                  #{item?.id}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        {item?.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item?.fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                            <FiUser size={20} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item?.fullName}</div>
                      <div className="text-gray-500 text-xs">{item?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                    }`}>
                    {item.role === 'admin' ? (
                      <>
                        <FiShield className="mr-1 text-purple-500" size={12} />
                        Admin
                      </>
                    ) : (
                      <>
                        <FiUser className="mr-1 text-blue-500" size={12} />
                        Người dùng
                      </>
                    )}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {item.isActive === 1 ? (
                    <span className="inline-flex items-center text-xs">
                      <FiCheckCircle className="mr-1.5 text-green-500" />
                      <span className="text-green-800 font-medium">Đã kích hoạt</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs">
                      <FiXCircle className="mr-1.5 text-red-500" />
                      <span className="text-red-800 font-medium">Chưa kích hoạt</span>
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                      onClick={(e) => handleMore(e, +item?.id)}
                    >
                      <FiMoreVertical />
                    </button>

                    {Number(item?.id) === showModal && (
                      <div
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()}
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                      >
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleRedirectDetail(+item?.id)}
                          >
                            <FiEye className="mr-3 text-gray-500" />
                            Xem chi tiết
                          </button>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={(e) => handleEdit(e, +item?.id)}
                          >
                            <FiEdit2 className="mr-3 text-gray-500" />
                            Chỉnh sửa
                          </button>
                          <button
                            className={`flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 ${item.isActive === 1
                              ? 'text-yellow-600'
                              : 'text-green-600'
                              }`}
                            onClick={(e) => handleToggleStatus(e, +item?.id, item.isActive)}
                          >
                            {item.isActive === 1 ? (
                              <>
                                <FiXCircle className="mr-3 text-yellow-500" />
                                Vô hiệu hóa
                              </>
                            ) : (
                              <>
                                <FiCheckCircle className="mr-3 text-green-500" />
                                Kích hoạt
                              </>
                            )}
                          </button>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={(e) => handleConfirmDelete(e, +item?.id)}
                          >
                            <FiTrash2 className="mr-3 text-red-500" />
                            Xoá
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50">
          <div className="text-gray-400 mb-2">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
          <p className="text-gray-500 text-sm mt-1">Không tìm thấy người dùng nào phù hợp với tiêu chí tìm kiếm</p>
        </div>
      ) : null}

      <Modal
        title="Xác nhận xóa người dùng"
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onOk={handleDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.</p>
      </Modal>
    </>
  );
};

export default Table;
