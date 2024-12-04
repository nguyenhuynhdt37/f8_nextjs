import { Breadcrumbs } from "@/components/admin/MainContent/Breadcrumbs";
import React from "react";
import ChapterCreate from "../create/[id]/page";
import Table from "@/components/admin/MainContent/EmployeeListingPage/TableEmployer/Table";
import Chapter from "@/components/admin/MainContent/Course/chapter";
interface Iprops {
  params: { id: string };
}
const breadcrumbItems = [
  { title: "Trang chủ", link: "/admin" },
  { title: "Khoá học", link: "/admin/course" },
  { title: "Chi tiết chương học", link: "/admin/course/chapter" },
];
const ChapterPage = ({ params }: Iprops) => {
  const { id } = params;
  return (
    <>
      <div className="ps-10 pt-10">
        <Breadcrumbs items={breadcrumbItems} />
        <Chapter id={id} />
      </div>
    </>
  );
};

export default ChapterPage;
