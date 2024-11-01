"use client";
import { RegiterCourseFree } from "@/api/api";
import Login from "@/components/client/Login";
import { useAppSelector } from "@/redux/hook/hook";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";

const ButtonRegiterStudy = ({ idCourse }: { idCourse: number }) => {
  const router = useRouter();
  const { accessToken } = useAppSelector((p) => p.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const handleSubmit = async () => {
    if (!accessToken) {
      setIsLoginOpen(true);
      return;
    } else {
      const result = await RegiterCourseFree({
        idCourse: idCourse,
        token: accessToken,
      });
      if (result?.statusCode === 200 || result?.statusCode === 201) {
        messageApi.open({
          type: "success",
          content: "Đăng ký khoá học thành công",
        });
        router.push(`/learning/${idCourse}`);
      } else {
        messageApi.open({
          type: "error",
          content: "This is an error message",
        });
      }
    }
  };
  return (
    <>
      {contextHolder}
      <div className="px-5 py-5">
        <button
          onClick={handleSubmit}
          className="w-full bg-[#0093fc] py-3 text-[1.4rem] rounded-3xl text-[#fff]"
        >
          Đăng ký học
        </button>
        <Login open={isLoginOpen} setOpen={setIsLoginOpen} />
      </div>
    </>
  );
};

export default ButtonRegiterStudy;
