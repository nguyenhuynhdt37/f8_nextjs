import { redirect } from "next/navigation";
import { message } from "antd";
import Learning from "@/components/client/Learning";

interface Iprops {
  params: { id: string };
}
const CourseDetail = async ({ params }: Iprops) => {
  const { id } = params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/courses/get-course-is-register-${id}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!res.ok) {
    redirect(`/courses/get-course-is-register-${id}`);
  }
  const result = await res?.json();
  const data = result?.data;
  return (
    <>
      <Learning data={data} />
    </>
  );
};

export default CourseDetail;
