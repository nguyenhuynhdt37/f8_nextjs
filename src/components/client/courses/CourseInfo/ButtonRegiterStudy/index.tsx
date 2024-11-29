"use client";
import { RegiterCourseFree } from "@/api/api";
import Login from "@/components/client/Login";
import { useAppSelector } from "@/redux/hook/hook";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import Swal from "sweetalert2";
const ButtonRegiterStudy = ({ idCourse }: { idCourse: number }) => {
  const auth = useAppSelector((p) => p.auth?.user);
  const router = useRouter();
  const ref = useRef<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const handleSubmit = async () => {
    if (!auth) {
      setIsLoginOpen(true);
      return;
    } else {
      const result = await RegiterCourseFree({
        idCourse: idCourse,
      });
      if (result?.statusCode === 200 || result?.statusCode === 201) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Bạn đã đăng ký thành công.",
          confirmButtonText: "Đóng",
        }).then((result) => {
          if (result.isConfirmed) {
            ref.current.continuousStart();
            router.push(`/learning/${idCourse}`);
          }
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Lỗi khi đăng ký khoá học, vui lòng thử lại cho",
        });
      }
    }
  };
  return (
    <>
      {contextHolder}
      <LoadingBar color="#0066df" ref={ref} />
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
