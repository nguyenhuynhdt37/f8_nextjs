"use client";
import { useAppDispatch } from "@/redux/hook/hook";
import { setStateNav } from "@/redux/reducers/slices/NavbarSlice";
import React, { useEffect } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
const PostList = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setStateNav(3));
  }, []);
  return (
    <div className="container text-[1.4rem] px-28 pt-10">
      <div className="text-[2.5rem] font-bold">Bài viết nổi bật</div>
      <div className="text-[#868686] py-[1rem]">
        Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình online và
        các kỹ thuật lập trình web.
      </div>
      <div className="grid grid-cols-8 mt-20 gap-10">
        <div className="col-span-6">
          <div className="p-10 border-2 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="w-12 mr-5 h-12 object-cover rounded-full"
                  src="https://scontent.fhan4-6.fna.fbcdn.net/v/t39.30808-6/468977220_564916422807164_6425151126870756605_n.jpg?stp=dst-jpg_p526x296&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG8TzQrzH_SA2BHnR-a4SGNwRBo5TAL6sjBEGjlMAvqyD2Xzgy9yVCUnNMufq8S-tznyDzMrb21X-AjDmPagyxi&_nc_ohc=Sw70VhE53sAQ7kNvgE25JVT&_nc_zt=23&_nc_ht=scontent.fhan4-6.fna&_nc_gid=AQ9d5-L5fdLFtihHOrxJF0h&oh=00_AYCj_qqz0EP98v7scNa_2zGsVEpVMw4eoAYuhDDEwnSTnA&oe=67546FDC"
                  alt=""
                />
                <div className="">Nguyễn Xuân Huỳnh</div>
              </div>
              <div className="">
                <MdOutlineMoreHoriz className="text-[3rem] text-[#a3a3a3] cursor-pointer" />
              </div>
            </div>
            <div className="mt-8 font-medium text-[1.6rem]">
              Tình yêu là gì ?
            </div>
            <div className="">Một ngày trước</div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="sticky">
            <div className="mb-10">
              <a href="https://www.youtube.com/@F8VNOfficial" target="_blank">
                <img
                  className="w-full rounded-2xl"
                  src="https://files.fullstack.edu.vn/f8-prod/banners/26/63dc61f2a061e.png"
                  alt=""
                />
              </a>
            </div>
            <div>
              <a href="https://www.youtube.com/@F8VNOfficial" target="_blank">
                <img
                  className="w-full rounded-2xl"
                  src="https://files.fullstack.edu.vn/f8-prod/banners/32/6421144f7b504.png"
                  alt=""
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;
