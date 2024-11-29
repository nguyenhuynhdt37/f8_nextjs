"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineFacebook } from "react-icons/md";
import { FaCertificate } from "react-icons/fa6";
import { TbBrandYoutubeFilled } from "react-icons/tb";
import { FaGithub } from "react-icons/fa";
import { useAppSelector } from "@/redux/hook/hook";
import { calculateYearsAgo } from "@/Utils/functions";
import RichTextEditor from "@/components/RichTextEditor";
import { useRouter } from "next/navigation";
const Profile = () => {
  const data = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const handleRouter = (id: number) => {
    router.push("/learning/" + id);
  };
  return (
    <div>
      <div className="px-[20rem] text-[1.4rem] pb-[3rem]">
        <div className="relative">
          <img
            className="h-[40rem] w-full object-cover rounded-3xl"
            src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/hinh-nen-free-fire-3d-5.jpg"
            alt=""
          />
          <div className="p-3 bg-[#fff] rounded-full absolute left-32 -bottom-36">
            <img
              className="rounded-full w-[16rem]"
              src={
                data?.user?.avatar ||
                "https://www.ldg.com.vn/media/uploads/uploads/27150036-27-hinh-gai-xinh-che-mat-lam-avt.jpg"
              }
              alt=""
            />
          </div>
        </div>
        <div className="pt-8 ps-[27rem] text-[3rem] font-medium">
          {data?.user?.fullName}
        </div>
        <div className="pt-28 px-10 grid grid-cols-5 gap-5">
          <div className="col-span-2">
            <div
              className=" p-5 rounded-2xl"
              style={{ boxShadow: "#0000001a 0 0 5px, #0000001a 0 0 1px" }}
            >
              <div className="text-[1.4rem] font-medium pb-2">Giới thiệu</div>
              <div className="flex py-4 items-center">
                <FaCertificate className="text-[1.5rem] text-[#808990] mr-5" />
                <div className="">Thành viên của</div>
                <div className="mx-2">F8 - Học lập trình để đi làm</div>
                <div className="">
                  từ {calculateYearsAgo(data?.user?.createdAt || 1)} năm trước
                </div>
              </div>
              {data?.user?.githubLink && (
                <div className="flex py-4 items-center">
                  <FaGithub className="text-[1.5rem] text-[#808990] mr-5" />
                  <a
                    href={data?.user?.githubLink}
                    target="_blank"
                    className="text-[#6390c2]"
                  >
                    {data?.user?.githubLink}
                  </a>
                </div>
              )}
              {data?.user?.facebookLink && (
                <div className="flex py-4 items-center">
                  <MdOutlineFacebook className="text-[1.5rem] text-[#808990] mr-5" />
                  <a
                    href={data?.user?.facebookLink}
                    target="_blank"
                    className="text-[#6390c2]"
                  >
                    {data?.user?.facebookLink}
                  </a>
                </div>
              )}
              {data?.user?.youtubeLink && (
                <div className="flex py-4 items-center">
                  <TbBrandYoutubeFilled className="text-[1.5rem] text-[#808990] mr-5" />
                  <a
                    href={data?.user?.youtubeLink}
                    target="_blank"
                    className="text-[#6390c2]"
                  >
                    {data?.user?.youtubeLink}
                  </a>
                </div>
              )}
            </div>
          </div>
          <div
            className="col-span-3 p-5 rounded-2xl"
            style={{ boxShadow: "#0000001a 0 0 5px, #0000001a 0 0 1px" }}
          >
            <div className="text-[1.4rem] font-medium pb-2">
              Các khoá học đã tham gia
            </div>
            {data?.courses?.length > 0 &&
              data?.courses?.map((p: any) => (
                <div
                  key={p?.id}
                  className="cursor-pointer"
                  onClick={() => handleRouter(p?.id)}
                >
                  <div className="flex items-center py-5 border-b-[0.1rem]">
                    <img
                      src={p?.banner}
                      className="w-[25rem] rounded-2xl mr-10"
                      alt=""
                    />
                    <div className="">
                      <div className="font-medium">{p?.title}</div>
                      {p?.introduce ? (
                        <div
                          className="custom-textview"
                          dangerouslySetInnerHTML={{ __html: p?.introduce }}
                        ></div>
                      ) : (
                        <p className="mt-5">Chưa cập nhật</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="px-10 mt-10">
          {data?.user?.bio && (
            <div
              className="  rounded-2xl   p-5"
              style={{ boxShadow: "#0000001a 0 0 5px, #0000001a 0 0 1px" }}
            >
              <div className="text-[1.4rem] font-medium pb-2">Thông tin</div>
              <div
                className="custom-textview"
                dangerouslySetInnerHTML={{ __html: data?.user?.bio }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
