import { Breadcrumbs } from "@/components/admin/MainContent/Breadcrumbs";
import CreateCourse from "@/components/admin/MainContent/Course/create";
import LessonCreate from "@/components/admin/MainContent/Course/lesson/create";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
const breadcrumbItems = [
  { title: "Trang chủ", link: "/admin" },
  { title: "Khoá học", link: "/admin/course" },
  { title: "Chi tiết khoá học", link: "/admin/course/create" },
];
interface CoursePageProps {
  params: { id: string };
}
const LessonCreatePage = async (context: CoursePageProps) => {
  const { id } = (await context.params) || {};
  const cookieStore = cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const resLessonType = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/lesson-type`,
    {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    }
  );
  if (!resLessonType.ok) redirect("/404");
  let dataLessonType = await resLessonType.json();
  dataLessonType = dataLessonType?.data;

  const resGroupLesson = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/grouplesson/course/${id}`,
    {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    }
  );
  if (!resGroupLesson.ok) redirect(`/admin/course/notfound/chapter/${id}`);
  let dataGroupLesson = await resGroupLesson.json();

  return (
    <>
      <div className="ps-10 pt-10">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <LessonCreate
        courseId={id}
        grouplessons={dataGroupLesson?.data}
        lessonType={dataLessonType}
      />
    </>
  );
};

export default LessonCreatePage;
