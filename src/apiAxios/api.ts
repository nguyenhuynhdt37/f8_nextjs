import axios from "axios";
import axiosInstance from "./axiosInstance";

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
    console.log("ress", res);

    return res.data;
  } catch (error: any) {
    return error;
  }
};
