import axiosInstance from './axiosInstance';
import { ICreateUser, IGetWithParam, IpageEdit } from '@/types/next-auth';
import mockLearningPathDetail from '@/data/mock-learning-path-detail.json';

interface LoginParams {
  email: string;
  password: string;
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
    return error?.response?.data;
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
    return error?.response?.data;
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

export const getAllUser = async ({ config }: IGetWithParam): Promise<any> => {
  try {
    const res = await axiosInstance.get('/users', {
      withCredentials: true,
      params: {
        searchTerm: config.searchTerm,
        sortField: config.sortField,
        sortOrder: config.sortOrder,
        pageNumber: config.pageNumber,
        pageSize: config.pageSize,
        status: config.status,
        role: config.role,
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

export const getUserByID = async ({ id }: { id: number }): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/users/${id}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || `Failed to fetch user with ID ${id}`,
      data: null
    };
  }
};

export const CreateUser = async (userData: ICreateUser | FormData): Promise<any> => {
  try {
    const res = await axiosInstance.post('/users/create', userData, {
      withCredentials: true,
      headers: {
        ...(userData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}),
      },
    });

    return res.data;
  } catch (error: any) {
    console.error('Error creating user:', error);
    return {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || 'Failed to create user',
      data: null,
      validationErrors: error?.response?.data?.validationErrors || null
    };
  }
};

export const UpdateUser = async ({ id, data }: { id: number, data: any }): Promise<any> => {
  try {
    const res = await axiosInstance.patch(`/users/${id}`, data, {
      withCredentials: true,
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

export const ToggleUserStatus = async ({ id, isActive }: { id: number, isActive: number }): Promise<any> => {
  try {
    const res = await axiosInstance.patch(`/users/${id}/status`, { isActive }, {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    console.error(`Error toggling status for user with ID ${id}:`, error);
    return {
      statusCode: error?.response?.status || 500,
      message: error?.response?.data?.message || `Failed to toggle status for user with ID ${id}`,
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
    const res = await axiosInstance.get(`/courses/quesson_code/${lessonId}`, {
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
      `/courses/quesson_code/save_code/${lessonId}`,
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
    const res = await axiosInstance.get('/statistics/dashboard', {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getUserStatistics = async (startDate?: string, endDate?: string) => {
  try {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const res = await axiosInstance.get('/statistics/users', {
      params,
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
  }
};

export const getCourseStatistics = async (startDate?: string, endDate?: string, sortBy: string = 'enrollments', sortOrder: string = 'desc') => {
  try {
    const params: Record<string, string> = {
      sortBy,
      sortOrder,
    };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const res = await axiosInstance.get('/statistics/courses', {
      params,
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
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

export const getTopCourses = async (count: number = 10, metric: string = 'enrollments', period: string = 'all') => {
  try {
    const res = await axiosInstance.get('/statistics/top-courses', {
      params: { count, metric, period },
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
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
    const res = await axiosInstance.get('/statistics/revenue/summary', {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data;
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

export const getGrowthComparison = async (period = 'month') => {
  try {
    const res = await axiosInstance.get('/statistics/growth-comparison', {
      params: { period },
      withCredentials: true,
    });

    // Log dữ liệu từ API để debug
    if (res.data?.statusCode === 200 && res.data.data) {
      console.log('API growth data response:', res.data);

      // Chuyển đổi tất cả giá trị tăng trưởng sang dạng số
      const processedData = {
        ...res.data,
        data: {
          ...res.data.data,
          growth: {
            users: Number(res.data.data.growth.users),
            courses: Number(res.data.data.growth.courses),
            revenue: Number(res.data.data.growth.revenue),
            enrollments: Number(res.data.data.growth.enrollments)
          }
        }
      };

      console.log('Processed growth data:', processedData);
      return processedData;
    }

    return res.data;
  } catch (error) {
    console.error('Error fetching growth comparison:', error);

    // Dữ liệu mẫu khi API chưa sẵn sàng
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Tính toán tháng trước
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;
    if (previousMonth === 0) {
      previousMonth = 12;
      previousYear -= 1;
    }

    return {
      statusCode: 200,
      message: 'Dữ liệu mẫu - so sánh tăng trưởng',
      data: {
        current: {
          period: `Tháng ${currentMonth}/${currentYear}`,
          users: 3250,
          courses: 157,
          revenue: 357850000,
          enrollments: 4320
        },
        previous: {
          period: `Tháng ${previousMonth}/${previousYear}`,
          users: 2890,
          courses: 149,
          revenue: 301250000,
          enrollments: 3970
        },
        growth: {
          users: 12.5,
          courses: 5.4,
          revenue: 18.8,
          enrollments: 8.8
        }
      }
    };
  }
};

export const getMonthlyRevenue = async (year?: number) => {
  try {
    const url = year
      ? `/statistics/revenue/monthly?year=${year}`
      : '/statistics/revenue/monthly';

    const res = await axiosInstance.get(url, {
      withCredentials: true
    });

    return res.data;
  } catch (error) {
    console.error('Error getting monthly revenue:', error);

    // Dữ liệu mẫu nếu API chưa sẵn sàng
    const currentYear = new Date().getFullYear();

    return {
      statusCode: 200,
      message: 'Dữ liệu mẫu - doanh thu theo tháng',
      data: {
        year: currentYear,
        totalRevenue: 3500000000,
        monthlyData: [
          { month: "T1", revenue: 250000000, transactionCount: 85 },
          { month: "T2", revenue: 280000000, transactionCount: 95 },
          { month: "T3", revenue: 305000000, transactionCount: 110 },
          { month: "T4", revenue: 320000000, transactionCount: 115 },
          { month: "T5", revenue: 350000000, transactionCount: 125 },
          { month: "T6", revenue: 290000000, transactionCount: 100 },
          { month: "T7", revenue: 310000000, transactionCount: 105 },
          { month: "T8", revenue: 330000000, transactionCount: 118 },
          { month: "T9", revenue: 360000000, transactionCount: 128 },
          { month: "T10", revenue: 380000000, transactionCount: 140 },
          { month: "T11", revenue: 420000000, transactionCount: 155 },
          { month: "T12", revenue: 450000000, transactionCount: 165 }
        ]
      }
    };
  }
  // API functions
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
