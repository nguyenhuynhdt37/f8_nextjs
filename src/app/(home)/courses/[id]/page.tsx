import { getCourseInfo } from "@/api/api";
import { Content, CourseInfo } from "@/components/client/courses";
import LoadingPage from "@/components/client/LoadingPage";
import { convertSecondsToYMDHMS } from "@/Utils/functions";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import useSWR from "swr";

interface CoursePageProps {
  params: { id: string };
}

const CoursePage = async (context: CoursePageProps) => {
  const { id } = (await context.params) || {};

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/${id}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    redirect("/404");
  }

  const data = await res.json();
  const content = data?.data;

  const totalSecconsCourse = content?.lessonGroups?.reduce(
    (store: number, group: any) => {
      group?.lectureDetail?.forEach((item: any) => {
        if (item?.lesson?.duration) {
          store += item?.lesson?.duration;
        }
      });
      return store;
    },
    0
  );
  const totalLesson = content?.lessonGroups?.reduce(
    (store: number, group: any) => {
      store += group?.lectureDetail?.length;
      return store;
    },
    0
  );

  const fomartTimeCourse = convertSecondsToYMDHMS(totalSecconsCourse || 0);
  return (
    <div className="container pb-20 mx-auto pt-5 grid grid-cols-3">
      <Content
        totalLesson={totalLesson}
        timeCourse={fomartTimeCourse}
        data={content}
      />
      <CourseInfo
        totalLesson={totalLesson}
        data={content}
        timeCourse={fomartTimeCourse}
      />
    </div>
  );
};

export default CoursePage;
