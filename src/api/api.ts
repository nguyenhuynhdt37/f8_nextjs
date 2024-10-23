import { GetUserInfo } from "./../../node_modules/@auth/core/providers/webauthn.d";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { headers } from "next/headers";

interface LoginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginParams): Promise<any> => {
  try {
    const res = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return res.data;
  } catch (error: any) {
    return error?.response;
  }
};
export const sendEmailAsync = async (email: string): Promise<any> => {
  try {
    const res = await axiosInstance.post("/auth/send-email", email);
    console.log("ress", res);

    return res.data;
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
};
export const CheckCodeActive = async ({
  email,
  codeID,
}: ICheckCode): Promise<any> => {
  try {
    const res = await axiosInstance.post("/auth/confirm-email", {
      email,
      codeID,
    });
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const GetUserInfoByToken = async (token: string): Promise<any> => {
  try {
    const res = await axiosInstance.get("/auth/getinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("ress", res);

    return res.data;
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
};

export const getCourseInfo = async ({ id }: { id: number }): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/courses/${id}`);
    console.log("ress", res);

    return res.data;
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
};

export const getFirstLesson = async ({ id }: { id: number }): Promise<any> => {
  try {
    const res = await axiosInstance.get(
      `/courses/get-fisrt-lesson-by-course/${id}`
    );
    console.log("ress", res);

    return res.data;
  } catch (error: any) {
    console.log(error);
    return error?.response?.data;
  }
};
