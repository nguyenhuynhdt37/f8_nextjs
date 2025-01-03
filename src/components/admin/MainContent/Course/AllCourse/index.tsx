'use client';
import React, { useEffect, useRef, useState } from 'react';
import Table from './Table';
import Search from './Search';
import Pagination from '../../Pagination';
import { getAllCourses } from '@/api/api';
import { IpageEdit } from '@/types/next-auth';
import LoadingPage from '@/components/client/LoadingPage';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingBar from 'react-top-loading-bar';

const Course = () => {
  const ref = useRef<any>(null);
  const [loadData, setLoadData] = useState<number>(0);
  const [data, setData] = useState<any>();
  const [params, setParams] = useState<IpageEdit>({
    pageSize: 10,
    pageNumber: 1,
    totalPage: 1,
    totalCount: 0,
    searchTerm: '',
    sortField: '',
    sortOrder: '',
  });

  useEffect(() => {
    const handleGetData = async () => {
      ref.current.continuousStart();
      const res = await getAllCourses({ config: params });
      ref.current.complete();
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
    };
    handleGetData();
  }, [loadData]);
  return (
    <div className="p-10 text-[1.4rem]">
      <LoadingBar color="#0066df" ref={ref} />
      <div className="flex justify-between">
        <div className="font-bold text-[2rem]">Quản lý Khoá học</div>
        <Search
          pageEdit={params}
          setPageEdit={setParams}
          setLoadData={setLoadData}
        />
        <div className="flex items-center">
          <></>
          <Link href={'/admin/course/create'}>
            <button className="px-5 py-3 bg-[#3084d6] rounded-2xl text-[#fff]">
              + Thêm mới
            </button>
          </Link>
        </div>
      </div>
      <Table
        data={data}
        params={params}
        setLoadData={setLoadData}
        setParams={setParams}
      />
    </div>
  );
};

export default Course;
