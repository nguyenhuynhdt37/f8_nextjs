import { Breadcrumbs } from "@/components/admin/MainContent/Breadcrumbs";
import CreateCourse from "@/components/admin/MainContent/Course/create";
import React from "react";
const breadcrumbItems = [
  { title: "Trang chủ", link: "/admin" },
  { title: "Khoá học", link: "/admin/course" },
  { title: "Chi tiết khoá học", link: "/admin/course/create" },
];
const CourseCreatePagge = () => {
  return (
    <>
      <div className="ps-10 pt-10">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <CreateCourse />
    </>
  );
};

export default CourseCreatePagge;
