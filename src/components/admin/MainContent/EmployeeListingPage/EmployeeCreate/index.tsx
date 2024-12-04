"use client";

import { useAppSelector } from "@/redux/hook/hook";
import { CreateUser } from "@/api/api";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ICreateUser } from "@/types/next-auth";
import Loading from "@/components/client/Loading";
import { checkIsEmail, hasValue, hasWhitespace } from "@/Utils/functions";
import { message, Switch } from "antd";

const EmployeeCreate = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [error, setError] = useState<any>({
    fullName: "",
    email: "",
    password: "",
  });
  const [data, setData] = useState<ICreateUser>({
    fullName: "",
    email: "",
    password: "",
    isActive: 0,
  });
  const [isLoadding, setIsLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    if (hasValue(error)) {
      messageApi.open({
        type: "error",
        content: "Vui lòng nhập đúng thông tin hợp lệ trước khi tạo tài khoản",
      });
      return;
    }
    if (data.email === "" || data.fullName === "" || data.password === "") {
      messageApi.open({
        type: "error",
        content: "Thông tin không được bỏ trống",
      });
      return;
    }
    setIsLoading(true);
    const result = await CreateUser(data);
    setIsLoading(false);

    if (result?.statusCode === 200 || result?.statusCode === 201) {
      messageApi.open({
        type: "success",
        content: "Tạo mới tài khoản thành công",
      });
      router.push("/admin/users");
    }
    if (result?.statusCode === 400) {
      setError({
        ...error,
        email: "Email này đã được sử dụng",
      });
    }
    if (result?.statusCode === 401)
      messageApi.open({
        type: "error",
        content: "Hết phiên đănng nhập vui lòng đăng nhập lại",
      });
  };
  const handleOnchange = (e: any) => {
    setError({
      ...error,
      [e.target.name]: "",
    });
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email" && !checkIsEmail(value)) {
      setError((prevError: ICreateUser) => ({
        ...prevError,
        [name]: "Địa chỉ email không hợp lệ",
      }));
    }

    if (name === "fullName" && !hasWhitespace(value)) {
      setError((prevError: ICreateUser) => ({
        ...prevError,
        [name]: "Tên người dùng ít nhất phải chứa 2 từ",
      }));
    }

    if (name === "password" && value.length < 8) {
      setError((prevError: ICreateUser) => ({
        ...prevError,
        [name]: "Mật khẩu phải chứa ít nhất 8 ký tự",
      }));
    }
  };
  const handleChecked = () => {
    setData({
      ...data,
      isActive: data?.isActive === 0 ? 1 : 0,
    });
  };
  return (
    <div className="text-[1.4rem] p-10">
      {contextHolder}
      <div className="text-left text-[2rem] pt-10 font-bold">
        Tạo mới người dùng
      </div>
      <div className="text-[#dd9ba0] py-2 my-4">
        Lưu ý, người dùng do bạn tạo ra thì có quyền mặc định là người dùng.
      </div>
      <div className="w-[40rem]">
        <div>
          <div className="">
            <div className="text-[1.5rem]">Tên người dùng</div>
            <input
              type="text"
              name="fullName"
              placeholder="Nhập tên của người dùng"
              className="px-4 mt-2 mb-2 bg-[#fff] py-3 focus:outline-none border-[#e0cacd] focus:border-[#dd9ba0] border-[0.2rem] rounded-xl y-3 w-full"
              onChange={handleOnchange}
              value={data.fullName}
              onBlur={(e) => handleBlur(e)}
            />
            <div className="pb-2 text-[#d52e74]">{error.fullName}</div>
          </div>
          <div className="">
            <div className="text-[1.5rem]">Email</div>
            <input
              name="email"
              type="email"
              placeholder="Nhập email của người dùng"
              className="px-4 mt-2 mb-2 bg-[#fff] py-3 focus:outline-none border-[#e0cacd] focus:border-[#dd9ba0] border-[0.2rem] rounded-xl y-3 w-full"
              onChange={handleOnchange}
              value={data.email}
              onBlur={handleBlur}
            />
            <div className="pb-2 text-[#d52e74]">{error.email}</div>
          </div>
          <div className="">
            <div className="text-[1.5rem]">Mật khẩu</div>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu của người dùng"
              className="px-4 mt-2 mb-2 bg-[#fff] py-3 focus:outline-none border-[#e0cacd] focus:border-[#dd9ba0] border-[0.2rem] rounded-xl y-3 w-full"
              onChange={handleOnchange}
              value={data.password}
              onBlur={handleBlur}
            />
            <div className="pb-2 text-[#d52e74]">{error.password}</div>
          </div>
          <div className="py-5">
            <span className="mr-4">Kích hoạt:</span>
            <Switch
              checked={data.isActive === 1 ? true : false}
              onChange={handleChecked}
            />
          </div>
          <button
            type="submit"
            className="bg-[#5385e7] flex items-center mt-4 text-[#fff] py-4 rounded-xl hover:bg-[#5d8be8] px-10"
            onClick={handleSubmit}
          >
            <span className="mr-2">Đăng ký</span>
            {isLoadding && <Loading />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCreate;
