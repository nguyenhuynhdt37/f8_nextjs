import React, { memo, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaImages } from 'react-icons/fa';
import { IoIosImages } from 'react-icons/io';

const Banner = ({ data, setData }: any) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    setData((prev: any) => {
      return {
        ...prev,
        banner: acceptedFiles[0],
      };
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleDeleteImage = (e: any) => {
    e.stopPropagation();
    setData((prev: any) => {
      return {
        ...prev,
        banner: null,
      };
    });
  };
  return (
    <>
      <div className="mt-10 relative ps-4 text-[1.6rem] font-medium">
        Banner khoá học
        <span className=" absolute top-2 left-0 w-[0.3rem] h-[0.3rem] rounded-full bg-[#1e75e5]"></span>
        <div>
          <div
            {...getRootProps()}
            className="p-10 mt-10 bg-[#fff] shadow-lg rounded-3xl"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="cursor-pointer border-2 items-center flex-col justify-center rounded-[2rem] w-full border-[#609fd6] border-dashed flex h-[20rem] p-10">
                <FaImages className="text-[5rem] text-[#609fd6]" />
                <div className="py-5">Thả ảnh vào đây</div>
              </div>
            ) : (
              <div>
                {data ? (
                  <div className="flex flex-col justify-center">
                    <img
                      src={URL.createObjectURL(data)}
                      className="object-cover"
                      alt={data.name}
                    />
                    <button
                      onClick={handleDeleteImage}
                      className=" rounded-2xl mt-10 w-44 bg-[#609fd6] text-center text-[1.3rem] text-[#fff] py-3 px-5"
                    >
                      Xoá ảnh
                    </button>
                  </div>
                ) : (
                  <div className="cursor-pointer border-2 items-center flex-col justify-center rounded-[2rem] w-full border-[#cedbe6] border-dashed flex h-[20rem] p-10">
                    <IoIosImages className="text-[5rem] text-[#609fd6]" />
                    <div className="py-5">
                      Kéo thả ảnh vào đây, hoặc chọn từ{' '}
                      <span className="text-[#609fd6]">thư mục</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Banner);
