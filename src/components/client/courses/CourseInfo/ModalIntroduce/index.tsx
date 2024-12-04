"use client";
import { getFirstLesson } from "@/api/api";
import { getVideoIdFromUrl } from "@/Utils/functions";
import { Modal } from "antd";
import React, { useState, useEffect } from "react";
import useSWR from "swr";

interface Iprops {
  isModalOpen: boolean;
  setIsModalOpen: (a: boolean) => void;
  id: number;
}
const ModalIntroduce = ({ isModalOpen, setIsModalOpen, id }: Iprops) => {
  const { data, isLoading, error } = useSWR(
    ["getFistLesson", id],
    () => getFirstLesson({ id }),
    {
      revalidateOnFocus: false, // Tắt refetch khi người dùng quay lại trang
      // revalidateOnReconnect: false, // Tắt refetch khi kết nối lại mạng
    }
  );
  const result = data?.data;
  console.log("re", data);

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
        <div className="font-bold text-[2.5rem]">{result?.title}</div>
        <div className="w-full h-[50rem] mt-10">
          <iframe
            src={`https://www.youtube.com/embed/${getVideoIdFromUrl(
              result?.lesson?.videoLink
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
