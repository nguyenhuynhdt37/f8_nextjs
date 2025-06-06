'use client';
import React, { useEffect, useRef, useState } from 'react';
import Table from './Table';
import Search from './Search';
import { getLesonpByCourseId } from '@/api/axios/api';
import { IpageEdit } from '@/types/next-auth';
import { useRouter } from 'next/navigation';
import LoadingBar from 'react-top-loading-bar';

const Lesson = ({ id }: any) => {
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
  const router = useRouter();
  const handleCreate = () => {
    ref.current.continuousStart();
    router.push(`/admin/courses/${id}/lesson/create`);
  };
  useEffect(() => {
    const handleGetData = async () => {
      ref.current.continuousStart();
      const res = await getLesonpByCourseId({ id, config: params });
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
        <div className="font-bold text-[2rem]">Quản lý bài học học</div>
        <Search
          pageEdit={params}
          setPageEdit={setParams}
          setLoadData={setLoadData}
        />
        <div className="flex items-center">
          <></>
          <div onClick={handleCreate}>
            <button className="px-5 py-3 bg-[#3084d6] rounded-2xl text-[#fff]">
              + Thêm mới
            </button>
          </div>
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

export default Lesson;
