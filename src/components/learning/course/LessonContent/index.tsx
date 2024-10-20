import { getVideoIdFromUrl } from "@/Utils/functions";
import React from "react";

const LessonContent = () => {
  const videoId = getVideoIdFromUrl(
    "https://www.youtube.com/watch?v=0SJE9dYdpps&list=PL_-VfJajZj0VgpFpEVFzS5Z-lkXtBe-x5"
  );
  return (
    <div className="col-span-3 max-h-[100vh] mb-[5rem] overflow-y-scroll">
      <div className="main h-[65rem] border-r-5">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <div className="px-20 text-[1.3rem] pt-20 mx-auto mb-[1000rem]">
        <div className="">
          <div className="text-[2.5rem] font-medium">
            Lời khuyên trước khi bước vào khoá học
          </div>
          <div className="py-2">Cập nhật tháng 11 năm 2022</div>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
