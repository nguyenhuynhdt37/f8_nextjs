import { LessonCreateAsync } from "@/api/api";
import RichTextEditor from "@/components/RichTextEditor";
import { getVideoIdFromUrl, isValidYoutubeUrlFunc } from "@/Utils/functions";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";

interface ILesson {
  videoLink: string;
  isValidYoutubeUrl: boolean;
}
const Lesson = ({
  courseId,
  lessonType,
  grouplesson,
  title,
  setTitleErrror,
}: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const ref = useRef<any>(null);
  const router = useRouter();
  const [Lesson, setLesson] = useState<ILesson>({
    videoLink: "",
    isValidYoutubeUrl: false,
  });
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<any>({
    errorUrl: false,
  });

  const handleOnchange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;
    console.log(value);

    if (name === "videoLink") {
      setError({ ...error, errorUrl: false });
      const isYoutute = isValidYoutubeUrlFunc(value);
      setLesson({
        videoLink: value,
        isValidYoutubeUrl: isYoutute,
      });
    }
  };
  const handleOnblur = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;

    if (name === "videoLink" && !Lesson.isValidYoutubeUrl) {
      setError({ ...error, errorUrl: true });
    }
  };
  const handleSubmit = async () => {
    let inValid = false;
    if (Lesson.videoLink === "" || !Lesson.isValidYoutubeUrl) {
      inValid = true;
      setError({ ...error, errorUrl: true });
    }
    if (!title) {
      setTitleErrror("Tiêu đề không được bỏ trống");
      inValid = true;
    }
    if (description === "") inValid = true;
    if (inValid) {
      message.open({
        content: "Vui lòng nhập đúng và đầy đủ nội dung",
        type: "error",
      });
    } else {
      const dataPost = {
        lectureDetail: {
          lessonTypeId: lessonType,
          title: title,
          lessonGroup: grouplesson,
        },
        lesson: {
          videoLink: Lesson.videoLink,
          description: description,
        },
      };
      ref.current.continuousStart();
      const res = await LessonCreateAsync(courseId, dataPost);
      ref.current.complete();
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        messageApi.open({
          type: "success",
          content:
            "Thêm câu hỏi thành công, bạn sẽ được chuyển đến trang danh sách câu hỏi",
        });
        router.push(`/admin/course/lesson/${courseId}`);
      } else {
        messageApi.open({
          type: "error",
          content: "có vấn đề xẩy xa vui lòng thử lại sau, f5 trang để thử lại",
        });
      }
    }
  };
  return (
    <div className="p-10 text-[1.4rem]">
      <LoadingBar color="#0066df" ref={ref} />
      {contextHolder}
      <div className="text-[3rem] font-medium py-10 items-center flex justify-between">
        Thông tin bài học
        <button
          onClick={handleSubmit}
          className="px-5 mt-10 text-[1.4rem] py-4 rounded-xl text-[#fff] bg-[#609fd6]"
        >
          Xác nhận
        </button>
      </div>
      <div className="font-medium pt-5 pb-5">Link youtube</div>
      <div className=" w-full ">
        <input
          onBlur={handleOnblur}
          name="videoLink"
          value={Lesson.videoLink}
          onChange={handleOnchange}
          placeholder="Điền link youtube của bạn (Lý do sever hiện tại không đủ để chứa toàn bộ nội dung khoá học)"
          className={`
            flex-1 px-5 py-5 obe w-full border-2 rounded-2xl focus:border-[#9bc2de] bg-inherit focus:outline-none`}
          type="text"
        />
        {error.errorUrl && (
          <div className="text-[#d46464] py-2 ps-5">
            Video Youtube không đúng định dạng
          </div>
        )}
      </div>
      <div>
        {Lesson.isValidYoutubeUrl && (
          <>
            <div className="py-2 pt-5 ps-2 text-[1.3rem] text-[#5886ca]">
              Preview
            </div>
            <div className="h-[55rem] rounded-2xl overflow-hidden">
              <iframe
                onBlur={handleOnblur}
                src={`https://www.youtube.com/embed/${getVideoIdFromUrl(
                  Lesson.videoLink
                )}?autoplay=0`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </>
        )}
        <div className="pt-5">
          <div className="">Nội dung chi tiết</div>
          <div className="pt-2">
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
