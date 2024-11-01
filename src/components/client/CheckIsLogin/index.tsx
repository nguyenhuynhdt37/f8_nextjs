"use client";
import { useAppDispatch } from "@/redux/hook/hook";
import {
  GetUserInfoByTokenRedux,
  setToken,
} from "@/redux/reducers/slices/AuthSlice";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CheckIsLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const handleCheck = async () => {
      if (!token) {
        return;
      }
      dispatch(GetUserInfoByTokenRedux(token))
        .unwrap()
        .then((data: any) => {
          // alert();
          dispatch(setToken(token));
          // router.push("/");
          return;
        })
        .catch(() => {
          messageApi.open({
            type: "error",
            content: "Hết phiên đăng nhập, vui lòng đăng nhập lại",
          });
          localStorage.removeItem("token");
          return;
        });
    };
    handleCheck();
  }, []);
  return <>{contextHolder}</>;
};

export default CheckIsLogin;
