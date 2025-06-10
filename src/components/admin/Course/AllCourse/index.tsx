'use client';
import React, { useEffect, useRef, useState } from 'react';
import Table from './Table';
import { getAllCourses } from '@/api/axios/api';
import { IpageEdit } from '@/types/next-auth';
import LoadingBar from 'react-top-loading-bar';
import { useRouter } from 'next/navigation';
import {
  Pagination,
  Select,
  DatePicker,
  Dropdown,
  Button,
  Input,
  Tooltip,
  Divider,
  Card,
  Badge,
  Space
} from 'antd';
import {
  SearchIcon,
  PlusIcon,
  FilterIcon,
  ArrowUpDown,
  Calendar,
  DollarSign,
  BookOpen,
  Users,
  Clock,
  DownloadIcon,
  UploadIcon,
  RefreshCw
} from 'lucide-react';
import { debounce } from 'lodash';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Course = () => {
  const ref = useRef<any>(null);
  const [loadData, setLoadData] = useState<number>(0);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<IpageEdit>({
    pageSize: 5,
    pageNumber: 1,
    totalPage: 1,
    totalCount: 0,
    searchTerm: '',
    sortField: 'createdAt',
    sortOrder: 'desc',
  });

  // Thêm các trạng thái lọc mới
  const [filters, setFilters] = useState({
    level: '',
    price: '',
    status: '',
    dateRange: [],
    lessonCount: '',
    userCount: ''
  });

  const router = useRouter();

  const handleCreate = () => {
    ref.current.continuousStart();
    router.push('/admin/course/create');
  };

  const fetchData = async () => {
    setLoading(true);
    ref.current.continuousStart();
    try {
      // Tạo đối tượng config với các tham số lọc
      const config = {
        ...params,
        level: filters.level,
        price: filters.price,
        status: filters.status === 'all' ? '' : filters.status,
        startDate: filters.dateRange[0] ? dayjs(filters.dateRange[0]).format('YYYY-MM-DD') : '',
        endDate: filters.dateRange[1] ? dayjs(filters.dateRange[1]).format('YYYY-MM-DD') : '',
        minLessons: filters.lessonCount ? filters.lessonCount.split('-')[0] : '',
        maxLessons: filters.lessonCount ? filters.lessonCount.split('-')[1] || '' : '',
        minUsers: filters.userCount ? filters.userCount.split('-')[0] : '',
        maxUsers: filters.userCount ? filters.userCount.split('-')[1] || '' : '',
      };

      const res = await getAllCourses({ config });
      ref.current.complete();

      if (res?.statusCode === 200) {
        setData(res.data);
        setParams({
          ...params,
          totalCount: res.data.pagination.totalItems,
          totalPage: res.data.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
      ref.current.complete();
    }
  };

  useEffect(() => {
    fetchData();
  }, [loadData]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setParams({
      ...params,
      pageNumber: page,
      pageSize: pageSize || params.pageSize
    });
    setLoadData(prev => prev + 1);
  };

  const handleSearch = debounce((value: string) => {
    setParams({
      ...params,
      searchTerm: value,
      pageNumber: 1
    });
    setLoadData(prev => prev + 1);
  }, 500);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));

    // Reset về trang đầu tiên khi thay đổi bộ lọc
    setParams({
      ...params,
      pageNumber: 1
    });

    // Đợi một chút để UI cập nhật trước khi gọi API
    setTimeout(() => {
      setLoadData(prev => prev + 1);
    }, 100);
  };

  const handleSortChange = (field: string) => {
    const newSortOrder = params.sortField === field && params.sortOrder === 'asc' ? 'desc' : 'asc';
    setParams({
      ...params,
      sortField: field,
      sortOrder: newSortOrder
    });
    setLoadData(prev => prev + 1);
  };

  const handleResetFilters = () => {
    setFilters({
      level: '',
      price: '',
      status: '',
      dateRange: [],
      lessonCount: '',
      userCount: ''
    });

    setParams({
      ...params,
      sortField: 'createdAt',
      sortOrder: 'desc',
      searchTerm: '',
      pageNumber: 1
    });

    setLoadData(prev => prev + 1);
  };

  const exportData = () => {
    // Chức năng xuất dữ liệu
    alert('Tính năng xuất dữ liệu đang được phát triển');
  };

  const importData = () => {
    // Chức năng nhập dữ liệu
    alert('Tính năng nhập dữ liệu đang được phát triển');
  };

  // Tính toán số lượng bộ lọc đang được áp dụng
  const activeFiltersCount = Object.values(filters).filter(value =>
    value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <LoadingBar color="#0066df" ref={ref} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Quản lý khóa học
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Quản lý tất cả khóa học trong hệ thống
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Tooltip title="Nhập dữ liệu">
            <Button
              icon={<UploadIcon size={16} />}
              onClick={importData}
              className="flex items-center"
            >
              Nhập
            </Button>
          </Tooltip>

          <Tooltip title="Xuất dữ liệu">
            <Button
              icon={<DownloadIcon size={16} />}
              onClick={exportData}
              className="flex items-center"
            >
              Xuất
            </Button>
          </Tooltip>

          <Button
            type="primary"
            icon={<PlusIcon size={16} />}
            onClick={handleCreate}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
          >
            Thêm khóa học
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col space-y-4">
          {/* Search bar */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="w-full md:w-96">
              <Input
                placeholder="Tìm kiếm theo tên khóa học..."
                prefix={<SearchIcon size={16} className="text-gray-400" />}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </div>

            <div className="flex gap-2 ml-auto">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'createdAt',
                      label: 'Ngày tạo',
                      onClick: () => handleSortChange('createdAt')
                    },
                    {
                      key: 'title',
                      label: 'Tên khóa học',
                      onClick: () => handleSortChange('title')
                    },
                    {
                      key: 'price',
                      label: 'Giá',
                      onClick: () => handleSortChange('price')
                    },
                    {
                      key: 'lessonCount',
                      label: 'Số bài học',
                      onClick: () => handleSortChange('lessonCount')
                    },
                    {
                      key: 'userCourseCounts',
                      label: 'Số học viên',
                      onClick: () => handleSortChange('userCourseCounts')
                    }
                  ]
                }}
                placement="bottomRight"
              >
                <Button className="flex items-center">
                  <ArrowUpDown size={16} className="mr-2" />
                  Sắp xếp
                  {params.sortField !== 'createdAt' && (
                    <Badge count={1} size="small" offset={[5, -3]} />
                  )}
                </Button>
              </Dropdown>

              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'filter-level',
                      label: (
                        <div className="p-1">
                          <p className="font-medium mb-2">Cấp độ</p>
                          <Select
                            placeholder="Chọn cấp độ"
                            style={{ width: 200 }}
                            value={filters.level || undefined}
                            onChange={(value) => handleFilterChange('level', value)}
                            allowClear
                          >
                            <Option value="1">Kiến thức cơ bản</Option>
                            <Option value="2">Kiến thức nâng cao</Option>
                            <Option value="3">Kiến thức chuyên sâu</Option>
                          </Select>
                        </div>
                      )
                    },
                    {
                      key: 'filter-price',
                      label: (
                        <div className="p-1">
                          <p className="font-medium mb-2">Giá</p>
                          <Select
                            placeholder="Lọc theo giá"
                            style={{ width: 200 }}
                            value={filters.price || undefined}
                            onChange={(value) => handleFilterChange('price', value)}
                            allowClear
                          >
                            <Option value="free">Miễn phí</Option>
                            <Option value="0-500000">Dưới 500,000₫</Option>
                            <Option value="500000-1000000">500,000₫ - 1,000,000₫</Option>
                            <Option value="1000000-2000000">1,000,000₫ - 2,000,000₫</Option>
                            <Option value="2000000-">Trên 2,000,000₫</Option>
                          </Select>
                        </div>
                      )
                    },
                    {
                      key: 'filter-status',
                      label: (
                        <div className="p-1">
                          <p className="font-medium mb-2">Trạng thái</p>
                          <Select
                            placeholder="Trạng thái"
                            style={{ width: 200 }}
                            value={filters.status || undefined}
                            onChange={(value) => handleFilterChange('status', value)}
                            allowClear
                          >
                            <Option value="all">Tất cả</Option>
                            <Option value="true">Đang hoạt động</Option>
                            <Option value="false">Đã vô hiệu</Option>
                          </Select>
                        </div>
                      )
                    },
                    {
                      key: 'filter-date',
                      label: (
                        <div className="p-1">
                          <p className="font-medium mb-2">Ngày tạo</p>
                          <RangePicker
                            style={{ width: 280 }}
                            onChange={(dates) => handleFilterChange('dateRange', dates)}
                          />
                        </div>
                      )
                    },
                    {
                      key: 'filter-lesson',
                      label: (
                        <div className="p-1">
                          <p className="font-medium mb-2">Số bài học</p>
                          <Select
                            placeholder="Số bài học"
                            style={{ width: 200 }}
                            value={filters.lessonCount || undefined}
                            onChange={(value) => handleFilterChange('lessonCount', value)}
                            allowClear
                          >
                            <Option value="0-10">Dưới 10 bài</Option>
                            <Option value="10-20">10 - 20 bài</Option>
                            <Option value="20-50">20 - 50 bài</Option>
                            <Option value="50-">Trên 50 bài</Option>
                          </Select>
                        </div>
                      )
                    },
                    {
                      key: 'filter-users',
                      label: (
                        <div className="p-1">
                          <p className="font-medium mb-2">Số học viên</p>
                          <Select
                            placeholder="Số học viên"
                            style={{ width: 200 }}
                            value={filters.userCount || undefined}
                            onChange={(value) => handleFilterChange('userCount', value)}
                            allowClear
                          >
                            <Option value="0-10">Dưới 10 học viên</Option>
                            <Option value="10-50">10 - 50 học viên</Option>
                            <Option value="50-100">50 - 100 học viên</Option>
                            <Option value="100-">Trên 100 học viên</Option>
                          </Select>
                        </div>
                      )
                    },
                    {
                      key: 'divider',
                      type: 'divider'
                    },
                    {
                      key: 'reset-filters',
                      label: 'Đặt lại bộ lọc',
                      onClick: handleResetFilters
                    }
                  ]
                }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button className="flex items-center">
                  <FilterIcon size={16} className="mr-2" />
                  Bộ lọc
                  {activeFiltersCount > 0 && (
                    <Badge count={activeFiltersCount} size="small" offset={[5, -3]} />
                  )}
                </Button>
              </Dropdown>

              {(activeFiltersCount > 0 || params.sortField !== 'createdAt') && (
                <Button
                  icon={<RefreshCw size={16} />}
                  onClick={handleResetFilters}
                  className="flex items-center"
                >
                  Đặt lại
                </Button>
              )}
            </div>
          </div>

          {/* Active filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Bộ lọc đang áp dụng:</span>

              {filters.level && (
                <Badge
                  count={`Cấp độ: ${filters.level === '1' ? 'Cơ bản' : filters.level === '2' ? 'Nâng cao' : 'Chuyên sâu'}`}
                  style={{ backgroundColor: '#108ee9' }}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange('level', '')}
                />
              )}

              {filters.price && (
                <Badge
                  count={`Giá: ${filters.price === 'free' ? 'Miễn phí' :
                    filters.price === '0-500000' ? 'Dưới 500,000₫' :
                      filters.price === '500000-1000000' ? '500,000₫ - 1,000,000₫' :
                        filters.price === '1000000-2000000' ? '1,000,000₫ - 2,000,000₫' :
                          'Trên 2,000,000₫'
                    }`}
                  style={{ backgroundColor: '#87d068' }}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange('price', '')}
                />
              )}

              {filters.status && (
                <Badge
                  count={`Trạng thái: ${filters.status === 'true' ? 'Hoạt động' : filters.status === 'false' ? 'Vô hiệu' : 'Tất cả'}`}
                  style={{ backgroundColor: '#2db7f5' }}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange('status', '')}
                />
              )}

              {filters.dateRange && filters.dateRange.length === 2 && (
                <Badge
                  count={`Ngày: ${dayjs(filters.dateRange[0]).format('DD/MM/YYYY')} - ${dayjs(filters.dateRange[1]).format('DD/MM/YYYY')}`}
                  style={{ backgroundColor: '#f50' }}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange('dateRange', [])}
                />
              )}

              {filters.lessonCount && (
                <Badge
                  count={`Bài học: ${filters.lessonCount === '0-10' ? 'Dưới 10' :
                    filters.lessonCount === '10-20' ? '10 - 20' :
                      filters.lessonCount === '20-50' ? '20 - 50' :
                        'Trên 50'
                    }`}
                  style={{ backgroundColor: '#722ed1' }}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange('lessonCount', '')}
                />
              )}

              {filters.userCount && (
                <Badge
                  count={`Học viên: ${filters.userCount === '0-10' ? 'Dưới 10' :
                    filters.userCount === '10-50' ? '10 - 50' :
                      filters.userCount === '50-100' ? '50 - 100' :
                        'Trên 100'
                    }`}
                  style={{ backgroundColor: '#eb2f96' }}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange('userCount', '')}
                />
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Table */}
      <Table
        data={data?.courses}
        loading={loading}
        setLoadData={setLoadData}
      />

      {/* Pagination */}
      {data && (
        <div className="mt-6 flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị {data.courses.length > 0 ? (params.pageNumber - 1) * params.pageSize + 1 : 0} đến {Math.min(params.pageNumber * params.pageSize, params.totalCount)} trong tổng số {params.totalCount} khóa học
          </div>

          <Pagination
            current={params.pageNumber}
            pageSize={params.pageSize}
            total={params.totalCount}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '50']}
            className="dark:text-white"
          />
        </div>
      )}
    </div>
  );
};

export default Course;
