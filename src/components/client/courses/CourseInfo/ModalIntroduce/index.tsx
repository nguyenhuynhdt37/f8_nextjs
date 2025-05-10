'use client';
import { getFirstLesson } from '@/api/axios/api';
import { getVideoIdFromUrl } from '@/Utils/functions';
import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr';

interface Iprops {
  isModalOpen: boolean;
  setIsModalOpen: (a: boolean) => void;
  id: number;
}
const ModalIntroduce = ({ isModalOpen, setIsModalOpen, id }: Iprops) => {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const handeFetchApi = async () => {
      if (id) {
        const res = await getFirstLesson({ id });
        if (res?.statusCode === 200) {
          setData(res?.data);
        };
      }

    }
    handeFetchApi();
  }, [id])

  return (
    <Modal
      title="Giới thiệu khóa học"
      open={isModalOpen}
      footer={null}
      onCancel={() => setIsModalOpen(false)}
      width={1000}
      centered
      destroyOnClose={true}
    >
      <div className="">
        <div className="font-bold text-[2.5rem]">{data?.title}</div>
        <div className="w-full h-[50rem] mt-10">
          <iframe
            src={`https://www.youtube.com/embed/${getVideoIdFromUrl(
              data?.lesson?.videoLink,
            )}?autoplay=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalIntroduce;
