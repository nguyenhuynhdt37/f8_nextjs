import { Breadcrumbs } from "@/components/admin/MainContent/Breadcrumbs";
import CreateCourse from "@/components/admin/MainContent/Course/create";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
const breadcrumbItems = [
  { title: "Trang chủ", link: "/admin" },
  { title: "Khoá học", link: "/admin/course" },
  { title: "Chi tiết khoá học", link: "/admin/course/create" },
];
const CourseCreatePagge = async () => {
  const cookieStore = cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/get-level`,
    {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    }
  );
  if (!res.ok) redirect("/404");
  let data = await res.json();
  data = data?.data;

  return (
    <>
      <div className="ps-10 pt-10">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <CreateCourse levels={data} />
    </>
  );
};

export default CourseCreatePagge;
