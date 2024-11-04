import { config } from "./../middleware";
import { log } from "console";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { headers } from "next/headers";
import { ICreateUser, IGetWithParam, IpageEdit } from "@/types/next-auth";

interface LoginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginParams): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      "/auth/login",
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const sendEmailAsync = async (email: string): Promise<any> => {
  try {
    const res = await axiosInstance.post("/auth/send-email", email);

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const activeShowLesson = async ({
  courseId,
  lessonId,
  groupId,
}: {
  courseId: number;
  lessonId: number;
  groupId: number;
}): Promise<any> => {
  try {
    const res = await axiosInstance.put(
      `/courses/update-active-lesson-course-${courseId}`,
      {
        lessonId,
        groupId,
      },
      { withCredentials: true }
    );

    return res.data;
  } catch (error: any) {
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

    return res.data;
  } catch (error: any) {
    return error?.response?.status;
  }
};

export const getCourseInfo = async ({ id }: { id: number }): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/courses/${id}`);

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getdataLesson = async ({
  courseId,
  lessonId,
}: any): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/courses/getLesson`, {
      withCredentials: true,
      params: {
        courseId: courseId,
        lessonId: lessonId,
      },
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getCourseLearningById = async ({
  courseId,
  token,
}: {
  courseId: number;
  token: string;
}): Promise<any> => {
  try {
    const res = await axiosInstance.get(
      `/courses/get-course-is-register-${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const RegiterCourseFree = async ({
  idCourse,
  token,
}: {
  idCourse: number;
  token: string;
}): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      `/courses/user/register/free`,
      idCourse,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const CreateUser = async (user: ICreateUser): Promise<any> => {
  try {
    const res = await axiosInstance.post("/users/create", user, {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getAllUser = async ({ config }: IGetWithParam): Promise<any> => {
  try {
    const res = await axiosInstance.get("/users", {
      withCredentials: true,
      params: {
        searchTerm: config.searchTerm,
        sortField: config.sortField,
        sortOrder: config.sortOrder,
        pageNumber: config.pageNumber,
        pageSize: config.pageSize,
      },
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getUserByID = async ({ id }: { id: number }): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/users/${id}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const UpdateUser = async ({ id, token, data }: any): Promise<any> => {
  try {
    const res = await axiosInstance.patch(`/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const UpdateImageUser = async ({
  id,
  token,
  data,
}: any): Promise<any> => {
  try {
    const res = await axiosInstance.patch(`/users/${id}/avatar`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const DeleteUser = async ({ id }: any): Promise<any> => {
  try {
    const res = await axiosInstance.delete(`/users/${id}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const DeleteCourse = async ({ id }: any): Promise<any> => {
  try {
    const res = await axiosInstance.delete(`/courses/delete`, {
      params: {
        courseId: id,
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const CreateLessonGroup = async ({ id, name }: any): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      `/courses/lesson-group/create`,
      { courseId: id, name },
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const DeleteLessonGroup = async ({ id }: any): Promise<any> => {
  try {
    const res = await axiosInstance.delete(`/courses/lesson-group/delete`, {
      params: {
        id: id,
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const CourseActive = async ({
  courseId,
  isActive,
}: any): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      `/courses/toogle-active-course`,
      {
        courseId: courseId,
        isActive: isActive,
      },
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const getFirstLesson = async ({ id }: any): Promise<any> => {
  try {
    const res = await axiosInstance.get(
      `/courses/get-fisrt-lesson-by-course/${id}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getAllCourses = async ({
  config,
}: IGetWithParam): Promise<any> => {
  try {
    const res = await axiosInstance.get("/courses/all", {
      withCredentials: true,
      params: {
        searchTerm: config.searchTerm,
        sortField: config.sortField,
        sortOrder: config.sortOrder,
        pageNumber: config.pageNumber,
        pageSize: config.pageSize,
      },
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getLesonGroupById = async ({
  id,
  config,
}: {
  id: number;
  config: IpageEdit;
}): Promise<any> => {
  try {
    const res = await axiosInstance.get(
      `/courses/group-lesson-by-course/${id}`,
      {
        withCredentials: true,
        params: {
          searchTerm: config.searchTerm,
          sortField: config.sortField,
          sortOrder: config.sortOrder,
          pageNumber: config.pageNumber,
          pageSize: config.pageSize,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const getLesonpByCourseId = async ({
  id,
  config,
}: {
  id: number;
  config: IpageEdit;
}): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/courses/lesson/course/${id}`, {
      withCredentials: true,
      params: {
        searchTerm: config.searchTerm,
        sortField: config.sortField,
        sortOrder: config.sortOrder,
        pageNumber: config.pageNumber,
        pageSize: config.pageSize,
      },
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const CourseCreate = async (formData: any): Promise<any> => {
  try {
    const res = await axiosInstance.post("/courses/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
export const QuestionLessonCreate = async (
  courseId: number,
  data: any
): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      `/courses/lesson/question/${courseId}`,
      data,
      {
        withCredentials: true,
      }
    );

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};
