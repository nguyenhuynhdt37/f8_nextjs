import { getCourseInfo } from "@/api/api";
import { Content, CourseInfo } from "@/components/client/courses";
import LoadingPage from "@/components/client/LoadingPage";
import { useCookie } from "@/hook/useCookie";
import { convertSecondsToYMDHMS } from "@/Utils/functions";
import { redirect } from "next/navigation";

interface CoursePageProps {
  params: { id: string };
}

const fetchCourseData = async (id: string) => {
  const cookieHeader = useCookie();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/${id}`,
    {
      cache: "no-store",
      headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    }
  );
  if (!res.ok) {
    redirect("/404");
  }

  const data = await res.json();
  return data?.data;
};

const CoursePage = async ({ params }: CoursePageProps) => {
  const { id } = params || {};
  const content = await fetchCourseData(id);

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
      if (group?.lectureDetail?.length > 0) {
        store += group?.lectureDetail?.length;
      }
      return store;
    },
    0
  );

  const fomartTimeCourse = convertSecondsToYMDHMS(totalSecconsCourse || 0);

  // Kiểm tra các giá trị được tính toán
  console.log("id:", id);
  console.log("totalLesson:", totalLesson);
  console.log("fomartTimeCourse:", fomartTimeCourse);

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
