import React, { useState } from 'react';
import { CreateComment, updateComment } from '@/api/axios/api';
import { message } from 'antd';
import { playSound } from '@/Utils/functions/SoundNumber';
import ReactQuillEditorComment from '../ReactQuillEditorComment';

const BoxComment = ({
  lessonId,
  data,
  comment,
  parentId,
  setComment,
  feedback,
  onShowMoreComment,
  rootParentId,
  setFeedback,
}: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const handlesubmit = () => {
    if (!comment) {
      alert('Bạn chưa nhập bình luận');
      return;
    } else {
      if (feedback?.type === 'add') {
        const handlePostData = async () => {
          var dataSubmit = {
            lessonId: lessonId,
            content: comment,
            parentId: parentId ? parentId : null,
          };
          messageApi.open({
            key,
            type: 'loading',
            content: 'Đang gửi bình luận...',
          });
          var res = await CreateComment(dataSubmit);
          if (res?.statusCode === 200 || res?.statusCode === 201) {
            messageApi.open({
              key,
              type: 'success',
              content: 'Gửi thành công!',
              duration: 2,
            });
            playSound('/sounds/commentSound.mp3');
            await new Promise(resolve => setTimeout(resolve, 1000));
            setFeedback({
              id: -1,
              type: 'add',
            });
            if (rootParentId) {
              console.log('parentId', rootParentId);
              onShowMoreComment(rootParentId);
            }
          } else {
            alert('Có lỗi xảy ra vui lòng thử lại sau');
          }
          setComment('');
          setImageUploadError(null);
        };
        handlePostData();
      } else if (feedback?.type === 'edit') {
        const handleEdit = async () => {
          if (comment === data?.content) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            messageApi.open({
              key,
              type: 'warning',
              content: 'Bình luận chưa được chỉnh sửa...',
            });
            return;
          }
          messageApi.open({
            key,
            type: 'loading',
            content: 'Đang sửa bình luận...',
          });
          var res = await updateComment({ idComment: feedback?.id, comment });
          if (res?.statusCode === 200 || res?.statusCode === 201) {
            messageApi.open({
              key,
              type: 'success',
              content: 'sửa bình luận thành công!',
              duration: 2,
            });
            playSound('/sounds/commentSound.mp3');
            await new Promise(resolve => setTimeout(resolve, 1000));
            setFeedback({
              id: -1,
              type: 'add',
            });
          } else {
            alert('Có lỗi xảy ra vui lòng thử lại sau');
          }
          setComment('');
          setImageUploadError(null);
        };
        handleEdit();
      }
    }
  };

  const handleEditorChange = (htmlContent: string) => {
    setComment(htmlContent);
  };

  const handleImageUploadError = (error: string) => {
    setImageUploadError(error);
    messageApi.open({
      key: 'imageError',
      type: 'error',
      content: `Lỗi tải ảnh: ${error}`,
      duration: 3,
    });
  };

  return (
    <div className="flex-1">
      {contextHolder}
      {imageUploadError && (
        <div className="text-red-500 mb-2 text-sm">
          Lỗi tải ảnh: {imageUploadError}
        </div>
      )}
      <ReactQuillEditorComment
        comment={comment || ''}
        setComment={handleEditorChange}
        height="200px"
        onImageUploadError={handleImageUploadError}
      />
      <div className="mt-10 flex justify-end">
        <button
          onClick={() =>
            setFeedback({
              id: -1,
              type: 'add',
            })
          }
          className="font-medium px-20 py-2.5 mr-5 rounded-3xl text-[#3590f1] border-[#3590f1] border-[0.1rem]"
        >
          Hủy
        </button>
        <button
          onClick={handlesubmit}
          className="font-medium px-20 py-2.5 rounded-3xl bg-[#3590f1] text-[#fff] border-[0.1rem]"
        >
          Bình luận
        </button>
      </div>
    </div>
  );
};

export default BoxComment;
