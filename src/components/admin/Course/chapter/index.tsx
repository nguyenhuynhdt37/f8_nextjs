'use client';
import React, { useEffect, useRef, useState } from 'react';
import Table from './Table';
import { getLesonGroupById } from '@/api/axios/api';
import { IpageEdit } from '@/types/next-auth';
import { useRouter } from 'next/navigation';
import LoadingBar from 'react-top-loading-bar';
import { toast } from 'sonner';

const Chapter = ({ id }: any) => {
  const ref = useRef<any>(null);
  const [loadData, setLoadData] = useState<number>(0);
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [params, setParams] = useState<IpageEdit>({
    pageSize: 10,
    pageNumber: 1,
    totalPage: 1,
    totalCount: 0,
    searchTerm: '',
    sortField: 'createdAt',
    sortOrder: 'desc',
  });

  const router = useRouter();

  // Filter states
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    dateRange: {
      start: '',
      end: '',
    },
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      ref.current.continuousStart();

      try {
        const res = await getLesonGroupById({
          id,
          config: params
        });

        if (res?.statusCode === 200 || res?.statusCode === 201) {
          setData(res?.data);
          setParams({
            ...params,
            totalCount: res?.data?.totalCount,
            totalPage: res?.data?.totalPage,
          });
        } else {
          setData(undefined);
          toast.error('Không thể tải dữ liệu chương học');
        }
      } catch (error) {
        toast.error('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
        ref.current.complete();
      }
    };

    fetchData();
  }, [loadData, id, params]);

  const handleCreate = () => {
    ref.current.continuousStart();
    router.push(`/admin/course/chapter/create/${id}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce search
    const timeoutId = setTimeout(() => {
      setParams({
        ...params,
        searchTerm: value,
        pageNumber: 1,
      });
      setLoadData(prev => prev + 1);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSortChange = (field: string) => {
    const newSortOrder = field === params.sortField && params.sortOrder === 'asc' ? 'desc' : 'asc';
    setParams({
      ...params,
      sortField: field,
      sortOrder: newSortOrder,
      pageNumber: 1,
    });
    setLoadData(prev => prev + 1);
  };

  const handleExport = () => {
    toast.success('Tính năng xuất dữ liệu đang được phát triển');
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <LoadingBar color="#0066df" ref={ref} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Quản lý chương học
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Quản lý các chương trong khóa học
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            Xuất dữ liệu
          </button>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors duration-150 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Thêm chương mới
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400 dark:text-gray-500">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              placeholder="Tìm kiếm theo tên chương..."
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors duration-150 flex items-center gap-2 min-w-[160px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
              </svg>
              Sắp xếp
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-auto">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                    Sắp xếp theo
                  </p>
                  <button
                    onClick={() => {
                      handleSortChange('createdAt');
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md ${params.sortField === 'createdAt' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Ngày tạo</span>
                      {params.sortField === 'createdAt' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${params.sortOrder === 'asc' ? 'rotate-180' : ''}`}>
                          <path fillRule="evenodd" d="M10 5a.75.75 0 01.75.75v6.638l1.96-2.158a.75.75 0 111.08 1.04l-3.25 3.5a.75.75 0 01-1.08 0l-3.25-3.5a.75.75 0 111.08-1.04l1.96 2.158V5.75A.75.75 0 0110 5z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      handleSortChange('name');
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md ${params.sortField === 'name' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Tên chương</span>
                      {params.sortField === 'name' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${params.sortOrder === 'asc' ? 'rotate-180' : ''}`}>
                          <path fillRule="evenodd" d="M10 5a.75.75 0 01.75.75v6.638l1.96-2.158a.75.75 0 111.08 1.04l-3.25 3.5a.75.75 0 01-1.08 0l-3.25-3.5a.75.75 0 111.08-1.04l1.96 2.158V5.75A.75.75 0 0110 5z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      handleSortChange('updatedAt');
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md ${params.sortField === 'updatedAt' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Ngày cập nhật</span>
                      {params.sortField === 'updatedAt' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${params.sortOrder === 'asc' ? 'rotate-180' : ''}`}>
                          <path fillRule="evenodd" d="M10 5a.75.75 0 01.75.75v6.638l1.96-2.158a.75.75 0 111.08 1.04l-3.25 3.5a.75.75 0 01-1.08 0l-3.25-3.5a.75.75 0 111.08-1.04l1.96 2.158V5.75A.75.75 0 0110 5z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        data={data}
        params={params}
        setLoadData={setLoadData}
        setParams={setParams}
      />

      {/* Pagination */}
      {data && data.data && data.data.length > 0 && (
        <div className="mt-6 flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị {(params.pageNumber - 1) * params.pageSize + 1} đến {Math.min(params.pageNumber * params.pageSize, params.totalCount || 0)} trong tổng số {params.totalCount || 0} chương
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (params.pageNumber > 1) {
                  setParams({ ...params, pageNumber: params.pageNumber - 1 });
                  setLoadData(prev => prev + 1);
                }
              }}
              disabled={params.pageNumber <= 1}
              className={`p-2 rounded-md ${params.pageNumber <= 1 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>

            {Array.from({ length: Math.min(5, params.totalPage || 1) }, (_, i) => {
              const totalPages = params.totalPage || 1;
              const pageNum = params.pageNumber <= 3
                ? i + 1
                : params.pageNumber >= totalPages - 2
                  ? totalPages - 4 + i
                  : params.pageNumber - 2 + i;

              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setParams({ ...params, pageNumber: pageNum });
                      setLoadData(prev => prev + 1);
                    }}
                    className={`w-10 h-10 rounded-md ${params.pageNumber === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}

            <button
              onClick={() => {
                const totalPages = params.totalPage || 1;
                if (params.pageNumber < totalPages) {
                  setParams({ ...params, pageNumber: params.pageNumber + 1 });
                  setLoadData(prev => prev + 1);
                }
              }}
              disabled={params.pageNumber >= (params.totalPage || 1)}
              className={`p-2 rounded-md ${params.pageNumber >= (params.totalPage || 1) ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chapter;
