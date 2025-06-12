import axiosInstance from './axiosInstance';
import { ICreateUser, IGetWithParam, IpageEdit } from '@/types/next-auth';
import { CreateUserDto, NotificationMessage, UpdateUserDto } from '@/types/user';

interface LoginParams {
  email: string;
  password: string;
}

interface ICheckCode {
  email: string;
  codeID: string;
}

export const login = async ({ email, password }: LoginParams): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      '/auth/login',
      {
        email,
        password,
      },
      { withCredentials: true },
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const AddCourseComplete = async (
  idLesson: number,
  idCourse: number,
): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      `/courses/lesson/complete`,
      {},
      {
        params: {
          lessonId: idLesson,
          courseId: idCourse,
        },
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const sendEmailAsync = async (email: string): Promise<any> => {
  try {
    const res = await axiosInstance.post('/auth/send-email', email);

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
      { withCredentials: true },
    );

    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const CheckCodeActive = async ({
  email,
  codeID,
}: ICheckCode): Promise<any> => {
  try {
    const res = await axiosInstance.post('/auth/confirm-email', {
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
    const res = await axiosInstance.get('/auth/getinfo', {
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
      },
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const RegiterCourseFree = async ({
  idCourse,
}: {
  idCourse: number;
}): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      `/courses/user/register/free`,
      idCourse,
      {
        withCredentials: true,
      },
    );

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const CheckIsCourseRegister = async ({
  idCourse,
}: {
  idCourse: number;
}): Promise<any> => {
  try {
    const res = await axiosInstance.get(
      `/courses/user/check-course-is-register/${idCourse}`,
      {
        withCredentials: true,
      },
    );

    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const getAllUser = async (config: any) => {
  try {
    const queryParams = new URLSearchParams();

    if (config.searchTerm) queryParams.append('searchTerm', config.searchTerm);
    if (config.role) queryParams.append('role', config.role);
    if (config.status) queryParams.append('status', config.status);
    if (config.pageNumber) queryParams.append('pageNumber', config.pageNumber.toString());
    if (config.pageSize) queryParams.append('pageSize', config.pageSize.toString());
    if (config.sortField) queryParams.append('sortField', config.sortField);
    if (config.sortOrder) queryParams.append('sortOrder', config.sortOrder);

    const response = await axiosInstance.get(`/users?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData: any) => {
  try {
    const response = await axiosInstance.post('/users', userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id: number, userData: any) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const toggleUserStatus = async (id: number, isActive: number) => {
  try {
    const endpoint = isActive === 1 ? `/users/${id}/enable` : `/users/${id}/disable`;
    const response = await axiosInstance.patch(endpoint, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const resetUserPassword = async (id: number) => {
  try {
    const response = await axiosInstance.post(`/users/reset-password/${id}`, {}, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const response = await axiosInstance.get('/users/roles', {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const sendNotification = async (notificationData: NotificationMessage): Promise<any> => {
  try {
    const res = await axiosInstance.post('/users/send-notification', notificationData, {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'Failed to send notification',
      data: null
    };
  }
};

export const UpdateUser = async ({ id, data }: { id: number, data: any }): Promise<any> => {
  try {
    // Check if data is FormData
    const isFormData = data instanceof FormData;

    const res = await axiosInstance.put(`/users/${id}`, data, {
      withCredentials: true,
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });

    return res.data;
  } catch (error: any) {
    console.error(`Error updating user with ID ${id}:`, error);
    return {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || `Failed to update user with ID ${id}`,
      data: null,
      validationErrors: error?.response?.data?.validationErrors || null
    };
  }
};

export const UpdateImageUser = async ({
  id,
  data,
}: {
  id: number,
  data: FormData
}): Promise<any> => {
  try {
    const res = await axiosInstance.patch(`/users/${id}/avatar`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (error: any) {
    console.error(`Error updating avatar for user with ID ${id}:`, error);
    return {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || `Failed to update avatar for user with ID ${id}`,
      data: null
    };
  }
};

export const DeleteUser = async ({ id }: { id: number }): Promise<any> => {
  try {
    const res = await axiosInstance.delete(`/users/${id}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    console.error(`Error deleting user with ID ${id}:`, error);
    return {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || `Failed to delete user with ID ${id}`,
      data: null
    };
  }
};

export const UpdateUserRole = async ({ id, role }: { id: number, role: string }): Promise<any> => {
  try {
    const res = await axiosInstance.patch(`/users/${id}/role`, { role }, {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    console.error(`Error updating role for user with ID ${id}:`, error);
    return {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || `Failed to update role for user with ID ${id}`,
      data: null
    };
  }
};

export const updateUserRole = async (id: number, role: string): Promise<any> => {
  return UpdateUserRole({ id, role });
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
      },
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
      },
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
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getAllCourses = async ({
  config,
}: IGetWithParam): Promise<any> => {
  try {
    const res = await axiosInstance.get('/courses/all-courses', {
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
    throw error?.response?.data;
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
      },
    );

    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
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
    throw error?.response?.data;
  }
};

export const CourseCreate = async (formData: any): Promise<any> => {
  try {
    const res = await axiosInstance.post('/courses/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const CourseEditAsync = async (
  formData: any,
  courseId: number,
): Promise<any> => {
  try {
    const res = await axiosInstance.put(`/courses/edit/${courseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const QuestionLessonCreate = async (
  courseId: number,
  data: any,
): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      `/courses/lesson/question/${courseId}`,
      data,
      {
        withCredentials: true,
      },
    );

    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const LessonCreateAsync = async (
  courseId: number,
  data: any,
): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      `/courses/lesson/create/${courseId}`,
      data,
      {
        withCredentials: true,
      },
    );

    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const NoteCreateAsync = async (
  courseId: number,
  data: any,
): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      `/courses/lesson/note/create/${courseId}`,
      data,
      {
        withCredentials: true,
      },
    );

    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const QuessonCodeCreate = async (
  courseId: number,
  data: any,
): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      `/courses/quesson_code/create/${courseId}`,
      data,
      {
        withCredentials: true,
      },
    );

    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const ViewNoteLesson = async (lessonId: number): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/courses/lesson/note/${lessonId}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const ViewQuestionLesson = async (lessonId: number): Promise<any> => {
  try {
    const res = await axiosInstance.get(
      `/courses/lesson/question/${lessonId}`,
      {
        withCredentials: true,
      },
    );

    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const logoutApi = async () => {
  try {
    const res = await axiosInstance.post(`/auth/logout`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getInfoUser = async () => {
  try {
    const res = await axiosInstance.get(`/auth/getinfo`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.status;
  }
};

export const uploadImage = async (formData: any) => {
  try {
    console.log('Starting image upload');

    // Ensure only avatar field is being sent
    if (formData instanceof FormData) {
      const fileEntry = formData.get('avatar');
      if (fileEntry && fileEntry instanceof File) {
        console.log('Uploading file:', fileEntry.name, 'size:', fileEntry.size, 'type:', fileEntry.type);
      } else {
        console.warn('FormData does not contain a valid file in the avatar field');
      }
    }

    // First attempt: try the /upload endpoint
    try {
      console.log('Trying primary endpoint: /upload');
      const res = await axiosInstance.post(`/upload`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Primary upload successful, response:', res.data);
      return res.data;
    } catch (primaryError: any) {
      console.error('Primary upload endpoint failed:', primaryError?.response?.data || primaryError);
      console.log('Trying fallback endpoint: /upload/avatar');

      // If the first attempt failed, try the fallback endpoint
      const fallbackRes = await axiosInstance.post(`/upload/avatar`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Fallback upload successful, response:', fallbackRes.data);
      return fallbackRes.data;
    }
  } catch (error: any) {
    console.error('All upload attempts failed:', error?.response?.data || error);
    // Return a standardized error response
    return {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'Lỗi khi tải lên hình ảnh',
      data: error?.response?.data || null,
      error: true
    };
  }
};

export const CreatePost = async (formData: FormData) => {
  try {
    console.log('Creating post with FormData');
    // Log FormData contents for debugging
    if (formData instanceof FormData) {
      console.log('FormData keys:');
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[0] === 'Content' ? 'Content text...' : pair[1]}`);
      }
    }

    const res = await axiosInstance.post(`/post/create`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('Error creating post:', error?.response?.data || error);
    return error?.response?.data || {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi tạo bài viết',
      data: null
    };
  }
};

export const UpdatePost = async (formData: FormData) => {
  try {
    console.log('Updating post with FormData');
    // Log FormData contents for debugging
    if (formData instanceof FormData) {
      console.log('FormData keys:');
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[0] === 'Content' ? 'Content text...' : pair[1]}`);
      }
    }

    const res = await axiosInstance.put(`/post/update`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('Error updating post:', error);

    // Log more detailed error information for debugging
    if (error.response) {
      console.error('Server response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }

    return error?.response?.data || {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi cập nhật bài viết',
      data: ""
    };
  }
};

export const getAllPostType = async (formData: any) => {
  try {
    const res = await axiosInstance.post(`/post/all/type`, formData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getAllPost = async ({ config }: IGetWithParam): Promise<any> => {
  try {
    const res = await axiosInstance.get('/post', {
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
    throw error?.response?.data;
  }
};

export const getAllPostByType = async ({ config, id }: any): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/post/type/${id}`, {
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
    throw error?.response?.data;
  }
};

export const getDashboardStatisticsByHomePage = async () => {
  try {
    const res = await axiosInstance.get('/statistics/dashboard/home-page', {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getAllCourseByLevel = async (id: number) => {
  try {
    const res = await axiosInstance.get(`/courses/level/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const CheckLessonComplete = async (lessonId: number) => {
  try {
    const res = await axiosInstance.get(
      `/courses/lesson/complete/${lessonId}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getNextLesson = async (lessonId: number) => {
  try {
    const res = await axiosInstance.get(`/courses/lesson/next/${lessonId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getPrevLesson = async (lessonId: number) => {
  try {
    const res = await axiosInstance.get(`/courses/lesson/prev/${lessonId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getQuessonCode = async (lessonId: number) => {
  try {
    const res = await axiosInstance.get(`/lesson/code/${lessonId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const SaveCodeUser = async (lessonId: number, code: string) => {
  try {
    const res = await axiosInstance.post(
      `/lesson/code/save_code/${lessonId}`,
      code,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const SubmitCode = async (submitCode: any) => {
  try {
    const res = await axiosInstance.post(
      `/courses/quesson_code/submit_code`,
      submitCode,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const CreateComment = async (comment: any) => {
  try {
    const res = await axiosInstance.post(`/lesson/comment/create`, comment, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getAllCommentByLessonId = async (lessonId: any) => {
  try {
    const res = await axiosInstance.get(`/lesson/comment/all/${lessonId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const ReportComment = async (idComment: any) => {
  try {
    const res = await axiosInstance.post(
      `/lesson/comment/reportComment/${idComment}`,
      {},
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const DeleteComment = async (idComment: any) => {
  try {
    const res = await axiosInstance.delete(
      `/lesson/comment/delete/${idComment}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const updateComment = async ({ idComment, comment }: any) => {
  try {
    const res = await axiosInstance.put(
      `/lesson/comment/edit/${idComment}`,
      comment,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const UnlikeComment = async (idComment: any) => {
  try {
    const res = await axiosInstance.delete(
      `/comment/like/unlike/${idComment}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const LikeChangeOrAdd = async (idComment: number, icon: string) => {
  try {
    const res = await axiosInstance.post(
      `/comment/like/add_or_change/${idComment}`,
      icon,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getProcess = async (courseId: number) => {
  try {
    const res = await axiosInstance.get(`/courses/progress/${courseId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getLanguageCodes = async () => {
  try {
    const res = await axiosInstance.get(
      `/courses/quesson_code/get_all_langueCode`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getChapterById = async (chapterId: number) => {
  try {
    const res = await axiosInstance.get(`/courses/chapter/${chapterId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const ChapterEditAsync = async ({ chapterId, name }: any) => {
  try {
    const res = await axiosInstance.put(
      `/courses/chapter/edit/${chapterId}`,
      name,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getChapterAndLesson = async (courseId: number) => {
  try {
    const res = await axiosInstance.get(
      `/courses/get-chapter-and-lesson/${courseId}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const ToggleChapterActive = async (chapterId: number) => {
  try {
    const res = await axiosInstance.get(
      `/courses/chapter/toggerActive/${chapterId}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const ToggleLessonActiveAsync = async (lessonId: number) => {
  try {
    const res = await axiosInstance.get(
      `/courses/lesson/toggerActive/${lessonId}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const MoveUpChapterPosition = async ({
  courseid,
  chapterId,
  position,
}: any) => {
  try {
    const res = await axiosInstance.post(
      `/courses/chapter/move-up/${courseid}`,
      { chapterId, postion: position },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const MoveDownChapterPosition = async ({
  courseid,
  chapterId,
  position,
}: any) => {
  try {
    const res = await axiosInstance.post(
      `/courses/chapter/move-down/${courseid}`,
      { chapterId, postion: position },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const MoveUpLessonPositionAsync = async (lessonId: number) => {
  try {
    const res = await axiosInstance.post(
      `/courses/lesson/move-up/${lessonId}`,
      {},
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const MoveDownLessonPositionAsync = async (lessonId: number) => {
  try {
    const res = await axiosInstance.post(
      `/courses/lesson/move-down/${lessonId}`,
      {},
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const GetPostOutstandingAsync = async () => {
  try {
    const res = await axiosInstance.get(`/post/outstanding`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getCourseInfoAsync = async (courseId: number) => {
  try {
    const res = await axiosInstance.get(`/courses/${courseId}/info`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const googleAuthAsync = async (code: string) => {
  try {
    const res = await axiosInstance.post(
      `/auth/google/callback`,
      { code },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const githubAuthAsync = async (code: string) => {
  try {
    const res = await axiosInstance.post(
      `/auth/github/callback`,
      { code },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getStudySchedule = async () => {
  try {
    const res = await axiosInstance.get(
      `/study-schedule/get_all_study`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getStudyScheduleDetailById = async (id: number) => {
  try {
    const res = await axiosInstance.get(
      `/study-schedule/get_by_learning_path_id/${id}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

// Statistics API calls
export const getDashboardStatistics = async () => {
  try {
    const res = await axiosInstance.get('/statistics/dashboard');
    return res.data;
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return null;
  }
};

export const getUserStatistics = async () => {
  try {
    const res = await axiosInstance.get('/statistics/users');
    return res.data;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    return null;
  }
};

export const getUserProfileStatistics = async () => {
  try {
    const res = await axiosInstance.get('/auth/profile/statistics', {
      withCredentials: true
    });
    return res.data;
  } catch (error: any) {
    console.error('Error fetching user profile statistics:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi lấy thông tin thống kê người dùng',
      data: null
    };
  }
};

export const getCourseStatistics = async () => {
  try {
    const res = await axiosInstance.get('/statistics/courses');
    return res.data;
  } catch (error) {
    console.error('Error fetching course statistics:', error);
    return null;
  }
};

export const getCourseStatisticsById = async (courseId: number) => {
  try {
    const res = await axiosInstance.get(`/statistics/courses/${courseId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getPaymentStatistics = async (startDate?: string, endDate?: string) => {
  try {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const res = await axiosInstance.get('/statistics/payments', {
      params,
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getRevenuePeriods = async () => {
  try {
    const res = await axiosInstance.get('/statistics/revenue/periods', {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getTopCourses = async (limit = 5) => {
  try {
    const res = await axiosInstance.get('/statistics/courses/top', {
      params: { limit }
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching top courses:', error);
    return null;
  }
};

export const getTopPerformers = async (count: number = 5) => {
  try {
    const res = await axiosInstance.get('/statistics/top-performers', {
      params: { count },
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getRevenueSummary = async () => {
  try {
    const res = await axiosInstance.get('/statistics/revenue/summary');
    return res.data;
  } catch (error) {
    console.error('Error fetching revenue summary:', error);
    return null;
  }
};

export const getSearch = async (q: string) => {
  try {
    const res = await axiosInstance.get(
      `/search`,
      {
        params: {
          'keyword': q
        },
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getSearchWithType = async (q: string, type: string, pageNumber: number) => {
  try {
    const res = await axiosInstance.get(
      `/search/search-users`,
      {
        params: {
          "keyword": q,
          "type": type,
          "page": pageNumber,
          "pageSize": 5
        },
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getDataFriendRequests = async (pageSize: number, pageNumber: number, q?: string) => {
  try {
    const res = await axiosInstance.get(
      `/friend/get_friend_requests`,
      {
        params: {
          "keyword": q,
          "pageIndex": pageNumber,
          "pageSize": pageSize
        },
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const checkCourseRegister = async ({ courseId }: { courseId: number }) => {
  try {
    const res = await axiosInstance.get(
      `/courses/user/check-course-is-register/${courseId}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const CreatePayment = async ({ courseId }: { courseId: number }) => {
  try {
    const res = await axiosInstance.post(
      `/vnpay/vnpay-create`,
      {
        courseId,
      },
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getGrowthComparison = async () => {
  try {
    const res = await axiosInstance.get('/statistics/growth');
    return res.data;
  } catch (error) {
    console.error('Error fetching growth comparison:', error);
    return null;
  }
};

export const getMonthlyRevenue = async (year?: number) => {
  try {
    const res = await axiosInstance.get('/statistics/revenue/monthly', {
      params: { year }
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    return null;
  }
};

export const getAdminPendingPosts = async (pageNumber = 1, pageSize = 10, sortField = '', sortOrder = '', searchTerm = '') => {
  try {
    const res = await axiosInstance.get('/post/admin/pending', {
      withCredentials: true,
      params: {
        pageNumber,
        pageSize,
        sortField,
        sortOrder,
        searchTerm
      }
    });
    return res.data;
  } catch (error: any) {
    console.error('Error fetching pending posts:', error);
    return error?.response?.data || {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi tải danh sách bài viết',
      data: null
    };
  }
};

export const approvePost = async (postId: number, isApproved: boolean, rejectionReason?: string) => {
  try {
    const data: any = { postId, isApproved };
    if (!isApproved && rejectionReason) {
      data.rejectionReason = rejectionReason;
    }

    const res = await axiosInstance.post('/post/admin/approve', data, {
      withCredentials: true
    });
    return res.data;
  } catch (error: any) {
    console.error('Error approving/rejecting post:', error);
    return error?.response?.data || {
      statusCode: 500,
      message: isApproved
        ? 'Có lỗi xảy ra khi phê duyệt bài viết'
        : 'Có lỗi xảy ra khi từ chối bài viết',
      data: null
    };
  }
};

export const reactToPost = async (blogId: number, action: 'add' | 'remove') => {
  try {
    const res = await axiosInstance.post(
      '/post/reaction',
      {
        blogId,
        action
      },
      {
        withCredentials: true
      }
    );
    return res.data;
  } catch (error: any) {
    console.error('Error reacting to post:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi thực hiện thao tác',
      data: null
    };
  }
};

export const getPostReactions = async (blogId: number) => {
  try {
    const res = await axiosInstance.get(`/post/${blogId}/reactions`, {
      withCredentials: true
    });
    return res.data;
  } catch (error: any) {
    console.error('Error getting post reactions:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi lấy danh sách người dùng đã thích bài viết',
      data: null
    };
  }
};

export const savePost = async (postId: number, action: 'save' | 'unsave') => {
  try {
    const res = await axiosInstance.post(
      '/post/save',
      {
        postId,
        action
      },
      {
        withCredentials: true
      }
    );
    return res.data;
  } catch (error: any) {
    console.error('Error saving/unsaving post:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi thực hiện thao tác',
      data: null
    };
  }
};

export const getSavedPosts = async (pageNumber = 1, pageSize = 10, sortField = 'SavedAt', sortOrder = 'desc') => {
  try {
    const res = await axiosInstance.get('/post/saved', {
      withCredentials: true,
      params: {
        pageNumber,
        pageSize,
        sortField,
        sortOrder
      }
    });
    return res.data;
  } catch (error: any) {
    console.error('Error getting saved posts:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi lấy danh sách bài viết đã lưu',
      data: null
    };
  }
};

export const isPostSaved = async (postId: number) => {
  try {
    const res = await axiosInstance.get(`/post/${postId}/is-saved`, {
      withCredentials: true
    });
    return res.data;
  } catch (error: any) {
    console.error('Error checking if post is saved:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi kiểm tra trạng thái lưu bài viết',
      data: null
    };
  }
};

export const editProfile = async (fullName: string, userName: string, bio: string) => {
  try {
    const res = await axiosInstance.put(`/auth/profile/update`, {
      fullName,
      userName,
      bio
    }, {
      withCredentials: true
    });
    return res.data;
  } catch (error: any) {
    console.error('Error checking if post is saved:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi kiểm tra trạng thái lưu bài viết',
      data: null
    };
  }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const res = await axiosInstance.put(`/auth/change-password`, {
      currentPassword,
      newPassword
    }, {
      withCredentials: true
    });
    return res.data;
  } catch (error: any) {
    console.error('Error checking if post is saved:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi kiểm tra trạng thái lưu bài viết',
      data: null
    };
  }
};

export const updateSocialLinks = async (facebookLink: string, youtubeLink: string, githubLink: string, linkedinLink: string, personalWebsite: string) => {
  try {
    const res = await axiosInstance.put(`/auth/profile/social-links`, {
      facebookLink,
      youtubeLink,
      githubLink,
      linkedinLink,
      personalWebsite
    }, {
      withCredentials: true
    });
    return res.data;
  } catch (error: any) {
    console.error('Error checking if post is saved:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi kiểm tra trạng thái lưu bài viết',
      data: null
    };
  }
};

export const updateAvatar = async (data: FormData) => {
  try {
    const res = await axiosInstance.put(`/auth/profile/avatar`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    return res.data;
  } catch (error: any) {
    console.error('Error checking if post is saved:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi kiểm tra trạng thái lưu bài viết',
      data: null
    };
  }
};

export const getMyCoursesAsync = async (pageNumber = 1, pageSize = 10, sortField = 'EnrolledAt', sortOrder = 'desc') => {
  try {
    const res = await axiosInstance.get('/auth/my-courses', {
      withCredentials: true,
      params: {
        pageNumber,
        pageSize,
        sortField,
        sortOrder
      }
    });
    return res.data;
  } catch (error: any) {
    console.error('Error fetching enrolled courses:', error);
    if (error.response?.data) {
      throw error.response.data;
    }
    throw {
      statusCode: 500,
      message: 'Có lỗi xảy ra khi lấy danh sách khóa học đã đăng ký',
      data: null
    };
  }
};

// Notification endpoints
export const getNotifications = async (page = 1, pageSize = 10) => {
  try {
    const response = await axiosInstance.get(`/auth/notifications?page=${page}&pageSize=${pageSize}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return null;
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const response = await axiosInstance.get('/auth/notifications/unread-count', {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return null;
  }
};

export const markNotificationAsRead = async (notificationId: number) => {
  try {
    const response = await axiosInstance.put(`/auth/notifications/${notificationId}/read`, {}, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return null;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axiosInstance.put('/auth/notifications/mark-all-read', {}, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return null;
  }
};

export const deleteNotificationById = async (notificationId: number) => {
  try {
    const response = await axiosInstance.delete(`/auth/notifications/${notificationId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return null;
  }
};

export const getUsers = async (
  pageNumber = 1,
  pageSize = 10,
  searchTerm = '',
  sortField = 'createdAt',
  sortOrder = 'desc',
  status = '',
  role = ''
): Promise<any> => {
  try {
    const res = await axiosInstance.get('/users', {
      withCredentials: true,
      params: {
        searchTerm,
        sortField,
        sortOrder,
        pageNumber,
        pageSize,
        status,
        role,
      },
    });

    return res.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'Failed to fetch users',
      data: null
    };
  }
};

export const getLearningPaths = async (): Promise<any> => {
  try {
    const res = await axiosInstance.get('/learning-paths', {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const getLearningPathById = async (id: number): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/learning-paths/${id}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

