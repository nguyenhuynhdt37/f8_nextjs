import { FooterBar, LessonContent, SideBar } from "@/components/learning";
import React from "react";

const CourseDetail = () => {
  return (
    <div className="pt-[5rem]">
      <div className="grid grid-cols-4">
        <LessonContent />
        <SideBar />
      </div>
      <FooterBar />
    </div>
  );
};

export default CourseDetail;
