import { getCurrentMonthAndYear, getVideoIdFromUrl } from "@/Utils/functions";
import React, { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

const Lesson = ({
  data,
  courseSuggestion,
  isCompleteLesson,
  setIsCompletedLesson,
}: any) => {
  console.log("completed", isCompleteLesson);

  return (
    <>
      {!isCompleteLesson?.isOldCompleted ? (
        <VideoPlayer
          data={data}
          isCompleted={isCompleteLesson}
          setIsCompleted={setIsCompletedLesson}
        />
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${getVideoIdFromUrl(
            data?.lessonVideo?.videoLink
          )}?autoplay=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      )}
      <div className="px-20 text-[1.3rem] pt-20 mx-auto  container mb-[2rem]">
        <div className="">
          <div className="text-[2.5rem] font-medium">{data?.title}</div>
          <div className="py-2">
            Cập nhật {getCurrentMonthAndYear(data?.updatedAt)}
          </div>
        </div>
        {data?.lessonVideo?.description && (
          <div className="custom-textview pt-10 text-2xl">
            <div
              dangerouslySetInnerHTML={{
                __html: data?.lessonVideo?.description,
              }}
            />
          </div>
        )}
        {courseSuggestion?.courseSuggestions && (
          <div className="custom-textview pt-10 text-2xl">
            <div
              dangerouslySetInnerHTML={{
                __html: courseSuggestion?.courseSuggestions,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Lesson;
