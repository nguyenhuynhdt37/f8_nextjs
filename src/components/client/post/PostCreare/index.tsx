'use client';
import Banner from '@/components/admin/MainContent/Course/create/Banner';
import OptionType from '@/components/admin/MainContent/Course/lesson/create/OptionType';
import { message, Modal, Form, Input, Alert, Tooltip } from 'antd';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CreatePost, uploadImage as apiUploadImage } from '@/api/axios/api';
import uploadImage, { generateUniqueFileName } from '@/Utils/functions/uploadImage';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiInfo, FiImage, FiTag, FiEye, FiX, FiCheck } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';

// Validation constants
const TITLE_MIN_LENGTH = 10;
const TITLE_MAX_LENGTH = 150;
const CONTENT_MIN_LENGTH = 100;

interface ValidationErrors {
  title?: string;
  content?: string;
  banner?: string;
  type?: string;
}

// Custom Button Component with proper TypeScript types
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'primary' | 'secondary' | 'danger' | 'success';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'primary',
  icon = null
}) => {
  const baseClasses = "rounded-full font-medium transition-all duration-300 flex items-center justify-center";

  const typeClasses = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white",
    success: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${typeClasses[type]} ${className} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

const PostCreate = ({ types }: any) => {
  const [content, setContent] = useState<string>('');
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<any>({
    title: '',
    banner: null,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'preview'
  const [isUploading, setIsUploading] = useState(false);
  const quillRef = useRef<any>(null);
  const router = useRouter();
  const [type, setType] = useState<any>(types && types.length > 0 ? types[0] : null);

  // Custom image handler for Quill
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/jpeg, image/png, image/gif, image/jpg');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];

        setIsUploading(true);

        try {
          // Generate a unique filename
          const renamedFile = generateUniqueFileName(file);

          console.log('Uploading image:', renamedFile.name, 'size:', renamedFile.size, 'type:', renamedFile.type);

          // Use the utility function to upload the image
          const imageUrl = await uploadImage(renamedFile);

          if (imageUrl && quillRef.current) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);

            console.log('Inserting image at URL:', imageUrl);

            // Insert image at cursor position
            quill.insertEmbed(range.index, 'image', imageUrl);

            // Move cursor after image
            quill.setSelection(range.index + 1, 0);
          }
        } catch (error) {
          console.error('Failed to upload image:', error);
          messageApi.error('Không thể tải ảnh lên. Vui lòng thử lại sau.');
        } finally {
          setIsUploading(false);
        }
      }
    };
  }, [messageApi]);

  // Quill modules configuration with custom image handler
  const modules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link', 'image'],
        ['clean'],
        ['code-block'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  // Custom styles for the Quill editor
  useEffect(() => {
    // Add custom styles to the Quill editor
    const style = document.createElement('style');
    style.innerHTML = `
      .ql-toolbar.ql-snow {
        border: none !important;
        border-bottom: 1px solid #e5e7eb !important;
        padding: 16px !important;
        border-top-left-radius: 8px !important;
        border-top-right-radius: 8px !important;
        background: #f9fafb !important;
      }
      
      .ql-container.ql-snow {
        border: none !important;
        font-size: 1.125rem !important;
        font-family: var(--font-lexend), system-ui, sans-serif !important;
      }
      
      .ql-editor {
        min-height: 60vh !important;
        max-height: 70vh !important;
        padding: 24px !important;
        font-size: 1.125rem !important;
        line-height: 1.8 !important;
      }
      
      .ql-editor p {
        margin-bottom: 1rem !important;
      }
      
      .ql-editor h1, .ql-editor h2, .ql-editor h3 {
        font-weight: 700 !important;
        margin-top: 1.5rem !important;
        margin-bottom: 1rem !important;
      }
      
      .ql-editor h1 {
        font-size: 2rem !important;
      }
      
      .ql-editor h2 {
        font-size: 1.75rem !important;
      }
      
      .ql-editor h3 {
        font-size: 1.5rem !important;
      }
      
      .ql-editor img {
        max-width: 100% !important;
        border-radius: 8px !important;
        margin: 1rem 0 !important;
      }
      
      .ql-editor blockquote {
        border-left: 4px solid #6366f1 !important;
        padding-left: 16px !important;
        color: #4b5563 !important;
        font-style: italic !important;
      }
      
      .ql-editor pre {
        background: #1e293b !important;
        color: #e2e8f0 !important;
        border-radius: 8px !important;
        padding: 16px !important;
        font-family: monospace !important;
      }
      
      .ql-editor code {
        background: #f1f5f9 !important;
        padding: 2px 4px !important;
        border-radius: 4px !important;
        font-family: monospace !important;
      }
      
      .ql-snow .ql-tooltip {
        border-radius: 8px !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        border: none !important;
      }
      
      .ql-snow .ql-picker.ql-expanded .ql-picker-options {
        border-radius: 8px !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        border: 1px solid #e5e7eb !important;
      }
      
      /* Dark mode support */
      .dark .ql-toolbar.ql-snow {
        background: #1e293b !important;
        border-bottom: 1px solid #334155 !important;
      }
      
      .dark .ql-container.ql-snow {
        color: #e2e8f0 !important;
      }
      
      .dark .ql-editor code {
        background: #334155 !important;
        color: #e2e8f0 !important;
      }
      
      .dark .ql-snow .ql-stroke {
        stroke: #94a3b8 !important;
      }
      
      .dark .ql-snow .ql-fill {
        fill: #94a3b8 !important;
      }
      
      .dark .ql-snow .ql-picker {
        color: #94a3b8 !important;
      }
      
      .dark .ql-snow .ql-picker-options {
        background: #1e293b !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Validate form before submission
  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validate title
    if (!data.title) {
      errors.title = 'Tiêu đề không được để trống';
    } else if (data.title.length < TITLE_MIN_LENGTH) {
      errors.title = `Tiêu đề phải có ít nhất ${TITLE_MIN_LENGTH} ký tự`;
    } else if (data.title.length > TITLE_MAX_LENGTH) {
      errors.title = `Tiêu đề không được vượt quá ${TITLE_MAX_LENGTH} ký tự`;
    }

    // Validate content
    if (!content) {
      errors.content = 'Nội dung bài viết không được để trống';
    } else {
      // Strip HTML to check actual content length
      const textContent = content.replace(/<[^>]*>/g, '').trim();
      if (textContent.length < CONTENT_MIN_LENGTH) {
        errors.content = `Nội dung bài viết phải có ít nhất ${CONTENT_MIN_LENGTH} ký tự`;
      }
    }

    // Validate type
    if (!type) {
      errors.type = 'Vui lòng chọn chủ đề cho bài viết';
    }

    // Validate banner
    if (!data.banner) {
      errors.banner = 'Vui lòng thêm ảnh bìa cho bài viết';
    }

    return errors;
  };

  // Validate title as user types
  const validateTitle = (value: string): string | undefined => {
    if (!value) {
      return 'Tiêu đề không được để trống';
    } else if (value.length < TITLE_MIN_LENGTH) {
      return `Tiêu đề phải có ít nhất ${TITLE_MIN_LENGTH} ký tự (hiện tại: ${value.length})`;
    } else if (value.length > TITLE_MAX_LENGTH) {
      return `Tiêu đề không được vượt quá ${TITLE_MAX_LENGTH} ký tự (hiện tại: ${value.length})`;
    }
    return undefined;
  };

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setData({
      ...data,
      title: newTitle,
    });

    // Update just the title error
    const titleError = validateTitle(newTitle);
    setErrors(prev => ({
      ...prev,
      title: titleError,
    }));
  };

  // Handle content change
  const handleContentChange = (value: string) => {
    setContent(value);

    // Validate content length
    const textContent = value.replace(/<[^>]*>/g, '').trim();
    if (textContent.length < CONTENT_MIN_LENGTH) {
      setErrors(prev => ({
        ...prev,
        content: `Nội dung bài viết phải có ít nhất ${CONTENT_MIN_LENGTH} ký tự (hiện tại: ${textContent.length})`,
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        content: undefined,
      }));
    }
  };

  const handleSubmit = async () => {
    // Final validation before submission
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.values(validationErrors)[0];
      messageApi.error(firstError || 'Vui lòng kiểm tra lại thông tin bài viết');

      // Switch to editor tab if there are content errors
      if (validationErrors.content) {
        setActiveTab('editor');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('Content', content || '');
      formData.append('BlogTypeId', type?.id?.toString() || '');
      formData.append('Title', data?.title || '');

      // Ensure banner is a File object
      if (data?.banner instanceof File) {
        formData.append('Banner', data.banner);
      } else if (data?.banner && typeof data.banner === 'string') {
        // If banner is a URL string, try to fetch and convert to File
        try {
          const response = await fetch(data.banner);
          const blob = await response.blob();
          const file = new File([blob], 'banner.jpg', { type: 'image/jpeg' });
          formData.append('Banner', file);
        } catch (error) {
          console.error('Error converting banner URL to File:', error);
          messageApi.error('Không thể xử lý ảnh bìa, vui lòng thử lại');
          setIsSubmitting(false);
          return;
        }
      }

      console.log('Submitting form with data:', {
        content: content?.substring(0, 100) + '...',
        blogTypeId: type?.id,
        title: data?.title,
        banner: data?.banner instanceof File ?
          `File: ${data.banner.name}, size: ${data.banner.size}` :
          (typeof data?.banner === 'string' ? 'URL string' : 'No banner')
      });

      const res = await CreatePost(formData);

      if (res?.statusCode === 200 || res?.statusCode === 201) {
        messageApi.success('Tạo bài viết thành công');
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/post');
      } else {
        throw new Error(res?.message || 'Có lỗi xảy ra khi tạo bài viết');
      }
    } catch (error: any) {
      console.error('Error creating post:', error);
      messageApi.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {contextHolder}

      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Tạo bài viết mới</h1>
              <p className="mt-2 text-indigo-100">Chia sẻ kiến thức và kinh nghiệm của bạn với cộng đồng</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button
                onClick={() => router.push('/post')}
                type="secondary"
                className="px-5 py-2.5 text-sm"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm"
                icon={<FiCheck />}
              >
                {isSubmitting ? 'Đang xuất bản...' : 'Xuất bản ngay'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Editor */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Title input */}
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <input
                  value={data.title}
                  onChange={handleTitleChange}
                  type="text"
                  placeholder="Tiêu đề bài viết..."
                  className={`w-full text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bg-transparent focus:outline-none ${errors.title ? 'border-b-2 border-red-500' : ''}`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.title ? (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  ) : (
                    <p className={`text-sm ${data.title.length > 0 && data.title.length < TITLE_MIN_LENGTH
                      ? 'text-amber-500'
                      : 'text-gray-500 dark:text-gray-400'
                      }`}>
                      {data.title.length}/{TITLE_MAX_LENGTH} ký tự
                    </p>
                  )}
                  <div className="flex items-center">
                    <Tooltip title="Tiêu đề nên ngắn gọn, hấp dẫn và mô tả chính xác nội dung bài viết">
                      <span className="text-gray-400 dark:text-gray-500 flex items-center">
                        <FiInfo className="mr-1" /> Gợi ý tiêu đề hay
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Editor/Preview tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`px-6 py-3 font-medium text-sm ${activeTab === 'editor'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    Soạn thảo
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-6 py-3 font-medium text-sm ${activeTab === 'preview'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                  >
                    Xem trước
                  </button>
                </div>
              </div>

              {/* Editor/Preview content */}
              <div className="p-1">
                {activeTab === 'editor' ? (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden relative">
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/70 dark:bg-gray-800/70 z-10 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                          <p className="mt-3 text-indigo-600 dark:text-indigo-400">Đang tải ảnh lên...</p>
                        </div>
                      </div>
                    )}
                    <ReactQuill
                      ref={quillRef}
                      value={content}
                      onChange={handleContentChange}
                      theme="snow"
                      placeholder="Viết nội dung bài viết của bạn ở đây..."
                      modules={modules}
                      formats={[
                        'header',
                        'font',
                        'size',
                        'bold',
                        'italic',
                        'underline',
                        'strike',
                        'blockquote',
                        'list',
                        'bullet',
                        'indent',
                        'link',
                        'image',
                        'color',
                        'background',
                        'align',
                        'code-block',
                      ]}
                    />
                    {errors.content && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-3 text-red-600 dark:text-red-400 text-sm">
                        {errors.content}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="min-h-[60vh] p-6 prose dark:prose-invert max-w-none">
                    {content ? (
                      <>
                        <h1>{data.title || 'Tiêu đề bài viết'}</h1>
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                        <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-xl">Chưa có nội dung để xem trước</p>
                        <p className="mt-2">Hãy thêm nội dung trong tab soạn thảo</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right column - Settings */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Thiết lập bài viết
                </h3>

                {/* Show any validation errors */}
                {Object.keys(errors).length > 0 && (
                  <Alert
                    message="Vui lòng sửa các lỗi sau trước khi xuất bản"
                    type="error"
                    description={
                      <ul className="list-disc pl-4 mt-2">
                        {Object.entries(errors).map(([key, value]) =>
                          value ? <li key={key} className="mt-1">{value}</li> : null
                        )}
                      </ul>
                    }
                    className="mb-6"
                    showIcon
                  />
                )}

                {/* Banner upload */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <FiImage className="mr-2 text-indigo-600 dark:text-indigo-400" />
                    Ảnh bìa bài viết
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <Banner data={data.banner} setData={setData} />
                    {errors.banner && (
                      <p className="text-red-500 mt-3 text-sm">{errors.banner}</p>
                    )}
                  </div>
                </div>

                {/* Post type selection */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <FiTag className="mr-2 text-indigo-600 dark:text-indigo-400" />
                    Chọn chủ đề
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <OptionType
                      className="grid grid-cols-2 gap-2"
                      data={types}
                      typeChoise={type}
                      setTypeChoise={setType}
                    />
                    {errors.type && (
                      <p className="text-red-500 mt-3 text-sm">{errors.type}</p>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  type={Object.keys(errors).length > 0 ? "secondary" : "success"}
                  className="w-full mt-6 py-3 text-base"
                  icon={<FiCheck />}
                >
                  {isSubmitting ? 'Đang xuất bản...' : 'Xuất bản ngay'}
                </Button>

                {/* Test page link */}
                <div className="mt-4 text-center">
                  <Link
                    href="/post/image-upload-test"
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    target="_blank"
                  >
                    Kiểm tra tải ảnh
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreate;
