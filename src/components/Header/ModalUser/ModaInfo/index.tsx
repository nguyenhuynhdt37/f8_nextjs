import React from "react";

const ModalInfo = () => {
  return (
    <div
      className="absolute p-10 bg-[#fff] text-[#666666] rounded-2xl w-[28.5rem] top-8 right-11"
      style={{ boxShadow: "0 -4px 32px #0003" }}
    >
      <div className="flex  pb-10 border-b-[0.1rem]">
        <div className="mr-7">
          <img
            className="w-20 rounded-full"
            src="https://files.fullstack.edu.vn/f8-prod/user_photos/299093/63fc362173671.jpg"
            alt=""
          />
        </div>
        <div className="">
          <div className="text-[1.6rem] text-[#000] font-medium">
            Nguyễn Xuân Huỳnh
          </div>
          <div className="py-1">@huynhnguyenxuan</div>
        </div>
      </div>
      <div className="py-5">Trang cá nhân</div>
    </div>
  );
};

export default ModalInfo;
