'use client';
import React, { useEffect, useRef, useState } from 'react';
import Table from './Table';
import Search from './Search';
import Pagination from '../../Pagination';
import { getAllCourses } from '@/api/axios/api';
import { IpageEdit } from '@/types/next-auth';
import LoadingPage from '@/components/client/LoadingPage';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingBar from 'react-top-loading-bar';
import { FiPlus, FiBook, FiFilter } from 'react-icons/fi';
import { Spin } from 'antd';

const Course = () => {
  const ref = useRef<any>(null);
  const [loadData, setLoadData] = useState<number>(0);
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [params, setParams] = useState<IpageEdit>({
    pageSize: 5,
    pageNumber: 1,
    totalPage: 1,
    totalCount: 0,
    searchTerm: '',
    sortField: '',
    sortOrder: '',
  });
  const router = useRouter();

  const handleCreate = () => {
    ref.current.continuousStart();
    router.push('/admin/course/create');
  };

  useEffect(() => {
    const handleGetData = async () => {
      setIsLoading(true);
      ref.current.continuousStart();

      try {
        const res = await getAllCourses({ config: params });
        if (res?.statusCode === 200 || res?.statusCode === 201) {
          setData(res?.data);
          setParams({
            ...params,
            totalCount: res?.data?.totalCount,
            totalPage: res?.data?.totalPage,
          });
        } else {
          setData(undefined);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setData(undefined);
      } finally {
        setIsLoading(false);
        ref.current.complete();
      }
    };

    handleGetData();
  }, [loadData]);

  return (
    <div className="p-4 bg-gray-50">
      <LoadingBar color="#4f46e5" ref={ref} height={2} />

      <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-indigo-50 rounded-md">
            <FiBook className="text-sm text-indigo-600" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-800">Quản lý khóa học</h1>
            <p className="text-xs text-gray-500">Tạo và quản lý các khóa học trong hệ thống</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreate}
            className="flex items-center px-3 py-1 text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
          >
            <FiPlus className="mr-0.5" /> Thêm khóa học
          </button>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="p-3 border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Search
              pageEdit={params}
              setPageEdit={setParams}
              setLoadData={setLoadData}
            />

            <div className="flex items-center">
              <button className="flex items-center px-2 py-1 text-xs bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                <FiFilter className="mr-0.5 text-xs" /> Lọc nâng cao
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spin size="small" tip="Đang tải..." />
          </div>
        ) : (
          <Table
            data={data}
            params={params}
            setLoadData={setLoadData}
            setParams={setParams}
          />
        )}
      </div>
    </div>
  );
};

export default Course;
