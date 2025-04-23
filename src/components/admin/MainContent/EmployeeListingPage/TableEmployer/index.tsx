'use client';
import { DeleteUser, getAllUser } from '@/api/axios/api';
import { useEffect, useRef, useState } from 'react';
import { IpageEdit, IPageListProps, IUser } from '@/types/next-auth';
import LoadingPage from '@/components/client/LoadingPage';
import Table from './Table';
import { message } from 'antd';
import Paganation from '../../Pagination';
import LoadingBar from 'react-top-loading-bar';

const TableEmployer = () => {
  const timeoutRef = useRef<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadData, setLoadData] = useState<number>(0);
  const [pageList, setPageList] = useState<IPageListProps<IUser> | undefined>(
    undefined,
  );
  const ref = useRef<any>(null);
  const [pageEdit, setPageEdit] = useState<IpageEdit>({
    pageSize: 9,
    pageNumber: 1,
    totalPage: 0,
    totalCount: 0,
    searchTerm: '',
    sortField: '',
    sortOrder: '',
  });

  useEffect(() => {
    const handleGetAllUser = async () => {
      if (pageEdit.totalPage === 0 && pageEdit.totalCount === 0) {
        setIsLoading(true);
      }
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
        // messageApi.open({
        //   type: "error",
        //   content: "Không thể tải được thông tin người dùng",
        // });
        setPageList(undefined);
      }
      setIsLoading(false);
    };

    handleGetAllUser();
  }, [loadData]);

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setPageEdit({
      ...pageEdit,
      searchTerm: value,
      pageNumber: 1,
      totalPage: 1,
      totalCount: 0,
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setLoadData(prev => prev + 1);
    }, 700);
  };
  return (
    <div className="text-[1.3rem]">
      {contextHolder}
      <LoadingBar color="#0066df" ref={ref} />
      <div className="flex pb-5 pt-5">
        <input
          type="text"
          placeholder="Search name..."
          value={pageEdit.searchTerm}
          onChange={handleSearch}
          className="w-[30rem] rounded-lg border-[0.1rem] px-5 py-[0.4rem] text-[1.3rem] font-normal  placeholder:text-[#443e3b] focus:outline-none focus:ring-1 focus:ring-[#e2b691]"
        />
      </div>
      <div className="py-4 text-[2.4rem] font-bold">
        Tổng số người dùng: {pageEdit?.totalCount || '0'}
      </div>
      <div className="relative flex h-full w-full flex-col rounded-xl bg-white bg-clip-border text-slate-700 shadow-md">
        <div className="relative mx-4 mt-4 overflow-hidden rounded-none bg-white bg-clip-border text-slate-700"></div>
        <div className=" p-0">
          <Table data={pageList?.data} />
        </div>
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
