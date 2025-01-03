import React, { use, useState } from 'react';
import ReactQuillEditorComment from '../ReactQuillEditorComment';
import { CreateComment, updateComment } from '@/api/api';
import { message } from 'antd';
import { playSound } from '@/Utils/functions/SoundNumber';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'github-markdown-css';
import 'highlight.js/styles/github.css';
import MarkdownEditor from '@/components/Edittor/MarkdownEditor';
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
            alert('Có lỗi xảy ra vui lòng thử lại sau');
          } else {
          }
          setComment('');
        };
        handleEdit();
      }
    }
  };
  const handleEditorChange = (editorState: any) => {
    setComment(editorState);
  };
  return (
    <div className="flex-1">
      {contextHolder}
      <MarkdownEditor
        value={comment} // Truyền giá trị editorState vào
        onChange={handleEditorChange} // Lắng nghe thay đổi
        height="30rem"
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
