import React, { useState } from 'react';
import { CreateComment, updateComment } from '@/api/axios/api';
import { message } from 'antd';
import { playSound } from '@/Utils/functions/SoundNumber';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'github-markdown-css';
import 'highlight.js/styles/github.css';
import MarkdownEditor from '@/components/Edittor/MarkdownEditor';
import RichTextEditor from '@/components/RichTextEditor';
import { FiSend, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const key = 'updatable';

  const handlesubmit = () => {
    if (!comment) {
      message.warning({
        content: 'Bạn chưa nhập bình luận',
        icon: <span className="text-amber-500">⚠️</span>,
      });
      return;
    } else {
      setIsSubmitting(true);
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
          try {
            await CreateComment(dataSubmit);
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
          } catch (error) {
            messageApi.error('Có lỗi xảy ra vui lòng thử lại sau');
          } finally {
            setIsSubmitting(false);
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
            setIsSubmitting(false);
            return;
          }
          messageApi.open({
            key,
            type: 'loading',
            content: 'Đang sửa bình luận...',
          });
          try {
            await updateComment({ idComment: feedback?.id, comment });

            messageApi.open({
              key,
              type: 'success',
              content: 'Sửa bình luận thành công!',
              duration: 2,
            });
            playSound('/sounds/commentSound.mp3');
            await new Promise(resolve => setTimeout(resolve, 1000));
            setFeedback({
              id: -1,
              type: 'add',
            });
          } catch (error) {
            messageApi.error('Có lỗi xảy ra vui lòng thử lại sau');
          } finally {
            setIsSubmitting(false);
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
      <div className="comment-editor-wrapper bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 transition-colors duration-300">
        <RichTextEditor
          value={comment}
          onChange={handleEditorChange}
        />
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <motion.button
          onClick={() =>
            setFeedback({
              id: -1,
              type: 'add',
            })
          }
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-sm font-medium"
        >
          <FiX className="text-lg" />
          <span>Hủy</span>
        </motion.button>
        <motion.button
          onClick={handlesubmit}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isSubmitting}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg ${isSubmitting ? 'bg-indigo-400 dark:bg-indigo-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'} text-white transition-colors text-sm font-medium`}
        >
          {isSubmitting ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <FiSend className="text-lg" />
          )}
          <span>{feedback?.type === 'edit' ? 'Cập nhật' : 'Bình luận'}</span>
        </motion.button>
      </div>

      <style jsx global>{`
        .comment-editor-wrapper .f8-editor-toolbar-hints,
        .comment-editor-wrapper .f8-editor-footer {
          display: none;
        }
        
        .comment-editor-wrapper .f8-editor-container {
          border-radius: 0.5rem;
          box-shadow: none;
        }
        
        .comment-editor-wrapper .f8-editor-container .ql-editor {
          min-height: 120px;
          max-height: 200px;
        }
        
        .comment-editor-wrapper .ql-toolbar.ql-snow {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        
        .comment-editor-wrapper .ql-container.ql-snow {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default BoxComment;
