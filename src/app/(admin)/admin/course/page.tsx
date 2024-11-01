import { Breadcrumbs } from "@/components/admin/MainContent/Breadcrumbs";
import Course from "@/components/admin/MainContent/Course/AllCourse";
import { useCookie } from "@/hook/useCookie";
import { cookies } from "next/headers";
import React from "react";

const breadcrumbItems = [
  { title: "Trang chủ", link: "/admin" },
  { title: "Khoá học", link: "/admin/users" },
];

const CoursePage = async () => {
  return (
    <>
      <div className="ps-10 pt-10">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <Course />
    </>
  );
};

export default CoursePage;
