'use client';
import { DeleteUser, ToggleUserStatus, getAllUser } from '@/api/axios/api';
import { useEffect, useRef, useState } from 'react';
import { IpageEdit, IPageListProps, IUser } from '@/types/next-auth';
import LoadingPage from '@/components/client/LoadingPage';
import Table from './Table';
import { Modal, message, Select, Dropdown, Menu, Button } from 'antd';
import Paganation from '../../Pagination';
import LoadingBar from 'react-top-loading-bar';
import { FiSearch, FiFilter, FiSliders, FiDownload, FiRefreshCw } from 'react-icons/fi';
import { CSVLink } from 'react-csv';

const TableEmployer = () => {
  const timeoutRef = useRef<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadData, setLoadData] = useState<number>(0);
  const [pageList, setPageList] = useState<IPageListProps<IUser> | undefined>(undefined);
  const ref = useRef<any>(null);
  const [pageEdit, setPageEdit] = useState<IpageEdit>({
    pageSize: 10,
    pageNumber: 1,
    totalPage: 0,
    totalCount: 0,
    searchTerm: '',
    sortField: 'id',
    sortOrder: 'desc',
    status: 'all',
    role: 'all',
  });
  const [exportData, setExportData] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

  // Load data when parameters change
  useEffect(() => {
    fetchUsers();
  }, [loadData]);

  const fetchUsers = async () => {
    if (pageEdit.totalPage === 0 && pageEdit.totalCount === 0) {
      setIsLoading(true);
    }
    ref.current.continuousStart();

    try {
      const res: any = await getAllUser({
        config: pageEdit,
      });

      ref.current.complete();
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        setPageList({
          data: res?.data?.data,
        });
        setPageEdit({
          ...pageEdit,
          totalPage: res?.data?.totalPage,
          totalCount: res?.data?.totalCount,
        });
      } else {
        messageApi.error({
          content: res?.message || "Không thể tải được thông tin người dùng",
          duration: 3,
        });
        setPageList(undefined);
      }
    } catch (error) {
      messageApi.error({
        content: "Đã xảy ra lỗi khi tải dữ liệu người dùng",
        duration: 3,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageEdit({
      ...pageEdit,
      searchTerm: value,
      pageNumber: 1,
    });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setLoadData(prev => prev + 1);
    }, 500);
  };

  const handleStatusFilterChange = (value: string) => {
    setPageEdit({
      ...pageEdit,
      status: value,
      pageNumber: 1,
    });
    setLoadData(prev => prev + 1);
  };

  const handleRoleFilterChange = (value: string) => {
    setPageEdit({
      ...pageEdit,
      role: value,
      pageNumber: 1,
    });
    setLoadData(prev => prev + 1);
  };

  const handleSortChange = (field: string, order: string) => {
    setPageEdit({
      ...pageEdit,
      sortField: field,
      sortOrder: order,
      pageNumber: 1,
    });
    setLoadData(prev => prev + 1);
  };

  const handleToggleUserStatus = async (id: number, isActive: number) => {
    ref.current.continuousStart();
    try {
      const res = await ToggleUserStatus({ id, isActive: isActive === 1 ? 0 : 1 });

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        messageApi.success({
          content: `Đã ${isActive === 1 ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản thành công`,
          duration: 3,
        });
        // Update the list
        setLoadData(prev => prev + 1);
      } else {
        messageApi.error({
          content: res?.message || `Không thể ${isActive === 1 ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản`,
          duration: 3,
        });
      }
    } catch (error) {
      messageApi.error({
        content: `Đã xảy ra lỗi khi ${isActive === 1 ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản`,
        duration: 3,
      });
    } finally {
      ref.current.complete();
    }
  };

  const handleDeleteUser = async (id: number) => {
    ref.current.continuousStart();
    try {
      const res = await DeleteUser({ id });

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        messageApi.success({
          content: "Xóa người dùng thành công",
          duration: 3,
        });
        // Update the list
        setLoadData(prev => prev + 1);
      } else {
        messageApi.error({
          content: res?.message || "Không thể xóa người dùng",
          duration: 3,
        });
      }
    } catch (error) {
      messageApi.error({
        content: "Đã xảy ra lỗi khi xóa người dùng",
        duration: 3,
      });
    } finally {
      ref.current.complete();
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) {
      messageApi.warning({
        content: "Vui lòng chọn ít nhất một người dùng",
        duration: 3,
      });
      return;
    }

    if (action === 'delete') {
      Modal.confirm({
        title: 'Xác nhận xóa người dùng',
        content: `Bạn có chắc chắn muốn xóa ${selectedItems.length} người dùng đã chọn không? Hành động này không thể hoàn tác.`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: async () => {
          ref.current.continuousStart();
          let successCount = 0;
          let errorCount = 0;

          for (const id of selectedItems) {
            try {
              const res = await DeleteUser({ id });
              if (res?.statusCode === 200 || res?.statusCode === 201) {
                successCount++;
              } else {
                errorCount++;
              }
            } catch (error) {
              errorCount++;
            }
          }

          if (successCount > 0) {
            messageApi.success({
              content: `Đã xóa thành công ${successCount} người dùng`,
              duration: 3,
            });
          }

          if (errorCount > 0) {
            messageApi.error({
              content: `Không thể xóa ${errorCount} người dùng`,
              duration: 3,
            });
          }

          setSelectedItems([]);
          setLoadData(prev => prev + 1);
          ref.current.complete();
        },
      });
    } else if (action === 'activate' || action === 'deactivate') {
      const isActive = action === 'activate' ? 1 : 0;

      Modal.confirm({
        title: `Xác nhận ${isActive === 1 ? 'kích hoạt' : 'vô hiệu hóa'} người dùng`,
        content: `Bạn có chắc chắn muốn ${isActive === 1 ? 'kích hoạt' : 'vô hiệu hóa'} ${selectedItems.length} người dùng đã chọn không?`,
        okText: 'Xác nhận',
        okType: isActive === 1 ? 'primary' : 'danger',
        cancelText: 'Hủy',
        onOk: async () => {
          ref.current.continuousStart();
          let successCount = 0;
          let errorCount = 0;

          for (const id of selectedItems) {
            try {
              const res = await ToggleUserStatus({ id, isActive });
              if (res?.statusCode === 200 || res?.statusCode === 201) {
                successCount++;
              } else {
                errorCount++;
              }
            } catch (error) {
              errorCount++;
            }
          }

          if (successCount > 0) {
            messageApi.success({
              content: `Đã ${isActive === 1 ? 'kích hoạt' : 'vô hiệu hóa'} thành công ${successCount} người dùng`,
              duration: 3,
            });
          }

          if (errorCount > 0) {
            messageApi.error({
              content: `Không thể ${isActive === 1 ? 'kích hoạt' : 'vô hiệu hóa'} ${errorCount} người dùng`,
              duration: 3,
            });
          }

          setSelectedItems([]);
          setLoadData(prev => prev + 1);
          ref.current.complete();
        },
      });
    }
  };

  const prepareExportData = () => {
    setIsExporting(true);

    const data = pageList?.data?.map(user => ({
      ID: user.id,
      'Họ và tên': user.fullName,
      Email: user.email,
      'Trạng thái': user.isActive === 1 ? 'Đã kích hoạt' : 'Chưa kích hoạt',
      'Vai trò': 'Người dùng' // Can be expanded with actual role data
    })) || [];

    setExportData(data);

    // Delay to allow CSV Link to work
    setTimeout(() => {
      setIsExporting(false);
    }, 500);
  };

  const handleRefresh = () => {
    setLoadData(prev => prev + 1);
  };

  return (
    <div className="text-base">
      {contextHolder}
      <LoadingBar color="#4f46e5" ref={ref} />

      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
              value={pageEdit.searchTerm}
              onChange={handleSearch}
              className="w-full py-3 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Select
              placeholder="Trạng thái"
              value={pageEdit.status}
              onChange={handleStatusFilterChange}
              className="min-w-[140px]"
              options={[
                { value: 'all', label: 'Tất cả' },
                { value: 'active', label: 'Đã kích hoạt' },
                { value: 'inactive', label: 'Chưa kích hoạt' },
              ]}
            />

            <Select
              placeholder="Vai trò"
              value={pageEdit.role}
              onChange={handleRoleFilterChange}
              className="min-w-[140px]"
              options={[
                { value: 'all', label: 'Tất cả' },
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'Người dùng' },
              ]}
            />

            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1" onClick={() => handleSortChange('id', 'desc')}>
                    ID (giảm dần)
                  </Menu.Item>
                  <Menu.Item key="2" onClick={() => handleSortChange('id', 'asc')}>
                    ID (tăng dần)
                  </Menu.Item>
                  <Menu.Item key="3" onClick={() => handleSortChange('fullName', 'asc')}>
                    Tên (A-Z)
                  </Menu.Item>
                  <Menu.Item key="4" onClick={() => handleSortChange('fullName', 'desc')}>
                    Tên (Z-A)
                  </Menu.Item>
                  <Menu.Item key="5" onClick={() => handleSortChange('email', 'asc')}>
                    Email (A-Z)
                  </Menu.Item>
                  <Menu.Item key="6" onClick={() => handleSortChange('email', 'desc')}>
                    Email (Z-A)
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Button className="flex items-center space-x-1">
                <FiSliders size={14} />
                <span>Sắp xếp</span>
              </Button>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="p-6 flex items-center justify-between border-b border-gray-100">
        <div className="text-xl font-medium text-gray-800">
          Tổng số người dùng: <span className="text-indigo-600 font-semibold">{pageEdit?.totalCount || '0'}</span>
        </div>

        <div className="flex items-center space-x-2">
          <CSVLink
            data={exportData}
            filename={"users-export.csv"}
            className={`flex items-center px-3 py-2 text-sm ${isExporting ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors`}
            onClick={prepareExportData}
          >
            <FiDownload className="mr-2" /> Xuất CSV
          </CSVLink>

          <button
            className="flex items-center px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={handleRefresh}
          >
            <FiRefreshCw className="mr-2" /> Làm mới
          </button>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="p-4 bg-indigo-50 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <span className="text-indigo-700 font-medium">
              Đã chọn {selectedItems.length} người dùng
            </span>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                onClick={() => handleBulkAction('activate')}
              >
                Kích hoạt
              </button>
              <button
                className="px-3 py-1.5 text-xs bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors"
                onClick={() => handleBulkAction('deactivate')}
              >
                Vô hiệu hóa
              </button>
              <button
                className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                onClick={() => handleBulkAction('delete')}
              >
                Xóa
              </button>
              <button
                className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                onClick={() => setSelectedItems([])}
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingPage />
          </div>
        ) : (
          <Table
            data={pageList?.data}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleUserStatus}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        )}
      </div>

      <div className="border-t border-gray-100">
        <Paganation
          pageEdit={pageEdit}
          setLoadData={setLoadData}
          setPageEdit={setPageEdit}
        />
      </div>
    </div>
  );
};

export default TableEmployer;
