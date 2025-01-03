'use client';
import { getProcess } from '@/api/api';
import Progressbar from '@/components/client/learning/header/Progressbar';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useRouter } from 'next/navigation';
import { use, useEffect, useRef, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';
import LoadingBar from 'react-top-loading-bar';
const Header = ({ data, courseId }: { data: any; courseId: number }) => {
  const router = useRouter();
  const [connection, setConnection] = useState<any>(null);
  const [progress, setProgress] = useState<any>({});
  const ref = useRef<any>(null);
  const handleGoBack = () => {
    ref.current.continuousStart();
    router.back();
  };
  const handleBackHome = () => {
    ref.current.continuousStart();
    router.push('/');
  };
  useEffect(() => {
    const handleRequest = async () => {
      const res = await getProcess(courseId);
      if (res?.statusCode === 200 || res?.statusCode === 201)
        setProgress(res?.data);
    };
    handleRequest();
  }, []);
  useEffect(() => {
    const connect = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/processHub`)
        .withAutomaticReconnect()
        .build();

      connection.on('ReceiveProcess', dataCommentNew => {
        setProgress(dataCommentNew);
      });
      connection.on('Error', error => {
        console.log(error);
      });

      try {
        await connection.start();
        setConnection(connection);
      } catch (err: any) {
        console.error('Connection failed: ', err.toString());
      }
    };
    connect();
    return () => {
      connection?.stop();
    };
  }, []);
  return (
    <header>
      <LoadingBar color="#0066df" ref={ref} />
      <div className="flex fixed top-0 left-0 right-0 h-[5rem] bg-[#29303b] items-center justify-between">
        <div className="flex text-[#fff] items-center">
          <button className="px-4 mx-5 py-5" onClick={handleGoBack}>
            <FaChevronLeft className="text-[1.6rem]" />
          </button>
          <div onClick={handleBackHome}>
            <img
              className="w-[3rem] cursor-pointer rounded-xl mr-10 hidden md:block"
              src="/logo/logo1.png"
              alt=""
            />
          </div>
          <div className="font-bold text-[1.4rem]">{data?.title}</div>
        </div>
        <Progressbar progress={progress} />
      </div>
    </header>
  );
};

export default Header;
