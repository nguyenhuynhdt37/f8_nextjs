"use client";
import RichTextEditor from "@/components/RichTextEditor";
import { Radio } from "antd";
import { FaImages } from "react-icons/fa6";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoIosImages } from "react-icons/io";
import Banner from "./Banner";
import CoursePrice from "./CoursePrice";

interface ICourseCreate {
  title: string;
  banner: File | null;
}
interface ICourseCreateDetails {}
const CreateCourse = () => {
  const [active, setActive] = useState<boolean>();
  const [checkbock, setcheckbock] = useState<number>(1);
  const [data, setData] = useState<ICourseCreate>({
    title: "",
    banner: null,
  });

  return (
    <div className="p-10 text-[1.3rem]">
      <div className="text-[2.5rem]  font-bold">Thêm Khoá học mới</div>
      <div className="mt-10">
        <input
          type="text"
          className="w-full rounded-xl placeholder-[#cecdcd] text-[3rem] py-11 px-10 text-[#fff] focus:outline-none bg-[#1e75e5]"
          placeholder="Tên của khoá học ...."
        />
        <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
          <div className="">Khẩu hiệu</div>
          <div className="">
            <input
              type="text"
              className="w-full mt-10 rounded-xl placeholder-[#908e8e] text-[1.4rem] py-4 px-10 shadow-lg text-[#000] focus:outline-none bg-[#fff]"
              placeholder="Tên của khoá học ...."
            />
          </div>
        </div>
        <CoursePrice />
        <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
          Level
          <span className="absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
          <div className="pt-10 cursor-pointer grid text-[1.4rem] grid-cols-6 gap-6">
            {!active ? (
              <div className="shadow-sm bg-[#fff] border-2 border-[#adc1e8] flex py-5 px-10 rounded-xl">
                <input type="radio" checked className="scale-150 mr-10" />
                All Level
              </div>
            ) : (
              <div className="shadow-sm bg-[#fff] border-2 border-[#e9e9e9] flex py-5 px-10 rounded-xl">
                <input
                  type="radio"
                  className="border-[#e9e9e9] scale-150 mr-10"
                />
                All Level
              </div>
            )}
          </div>
        </div>
        <Banner data={data?.banner} setData={setData} />
        <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
          Mô tả
          <span className="absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
          <div className="pt-10">
            <RichTextEditor />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
            Gợi ý khoá học
            <span className="absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
            <div className="pt-10">
              <RichTextEditor />
            </div>
          </div>
          <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
            Kết quả sau khi học xong khoá học
            <span className="absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
            <div className="pt-10">
              <RichTextEditor />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-10">
        <button className="px-10 py-4 rounded-2xl bg-[#609fd6] text-[#fff]">
          Tạo mới
        </button>
      </div>
    </div>
  );
};

export default CreateCourse;
