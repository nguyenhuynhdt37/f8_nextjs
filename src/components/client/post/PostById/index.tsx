'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import { message, Modal, Form, Input, Alert, Tooltip, Select } from 'antd';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'github-markdown-css';
import { UpdatePost, reactToPost, getPostReactions, savePost, isPostSaved } from '@/api/axios/api';
import uploadImage, { generateUniqueFileName } from '@/Utils/functions/uploadImage';
import Banner from '@/components/admin/MainContent/Course/create/Banner';
import { FaFacebook, FaTwitter, FaVolumeUp, FaVolumeMute, FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import axios from 'axios';
import Head from 'next/head';
import { generateSlug } from '@/Utils/functions/slugify';

// Icons
import {
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiEdit,
  FiCopy,
  FiBookmark,
  FiCheckCircle,
  FiArrowLeft,
  FiInfo,
  FiEye,
  FiCheck,
  FiX,
  FiTag,
  FiImage
} from 'react-icons/fi';

// Validation constants
const TITLE_MIN_LENGTH = 10;
const TITLE_MAX_LENGTH = 150;
const CONTENT_MIN_LENGTH = 100;

interface ValidationErrors {
  title?: string;
  content?: string;
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

const PostById = ({ data }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(state => state.auth?.user?.user);
  const [messageApi, contextHolder] = message.useMessage();

  // Post states
  const [liked, setLiked] = useState(data?.post?.hasReacted || false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [readingTime, setReadingTime] = useState<number>(0);
  const [tableOfContents, setTableOfContents] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [likeCount, setLikeCount] = useState(data?.post?.reactionCount || 0);
  const [isReactingToPost, setIsReactingToPost] = useState(false);
  const [showReactionUsers, setShowReactionUsers] = useState(false);
  const [reactionUsers, setReactionUsers] = useState<any[]>([]);
  const [isLoadingReactions, setIsLoadingReactions] = useState(false);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'editor' or 'preview'
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Content states
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [postData, setPostData] = useState<any>({
    title: '',
    banner: null,
    blogTypeId: null,
  });

  // Refs
  const quillRef = useRef<any>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactionMenuRef = useRef<HTMLDivElement>(null);

  // Initialize content from post data
  useEffect(() => {
    if (data?.post) {
      setContent(data.post.content || '');
      setTitle(data.post.title || '');
      setPostData({
        title: data.post.title || '',
        banner: data.post.banner || null,
        blogTypeId: data.post.blogTypeId || null,
      });

      // Calculate reading time
      const text = data.post.content.replace(/<[^>]*>/g, '');
      const words = text.split(/\s+/).length;
      const readingTimeMinutes = Math.ceil(words / 200); // Average reading speed
      setReadingTime(readingTimeMinutes);

      // Generate table of contents
      generateTableOfContents(data.post.content);

      // Initialize like state from post data
      setLiked(data.post.hasReacted || false);
      setLikeCount(data.post.reactionCount || 0);
    }
  }, [data?.post]);

  // Extract headings from content to generate table of contents
  const generateTableOfContents = (htmlContent: string) => {
    if (!htmlContent) return;

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Find all heading elements
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const toc: Array<{ id: string; text: string; level: number }> = [];

    headings.forEach((heading, index) => {
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.substring(1)); // Extract level from tag name (h1 -> 1, h2 -> 2)

      // Create a unique ID for the heading
      const id = `heading-${index}-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;

      // Add ID to the original heading in the content
      heading.id = id;

      toc.push({ id, text, level });
    });

    setTableOfContents(toc);

    // Update the content with IDs added to headings
    setContent(tempDiv.innerHTML);
  };

  // Scroll to a specific heading when clicked in the table of contents
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle clicks outside the share menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle clicks outside the reaction users menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (reactionMenuRef.current && !reactionMenuRef.current.contains(event.target as Node)) {
        setShowReactionUsers(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        messageApi.loading('Đang tải ảnh lên...');

        try {
          // Generate a unique filename
          const renamedFile = generateUniqueFileName(file);

          // Upload image
          const imageUrl = await uploadImage(renamedFile);

          if (imageUrl && quillRef.current) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);

            // Insert image at cursor position
            quill.insertEmbed(range.index, 'image', imageUrl);

            // Move cursor after image
            quill.setSelection(range.index + 1, 0);
            messageApi.success('Tải ảnh thành công');
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

  // Set active nav item
  useEffect(() => {
    dispatch(setStateNav(3));

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
        color: #1a202c !important;
      }
      
      .ql-editor p {
        margin-bottom: 1rem !important;
      }
      
      .ql-editor h1, .ql-editor h2, .ql-editor h3 {
        font-weight: 700 !important;
        margin-top: 1.5rem !important;
        margin-bottom: 1rem !important;
        color: #1a202c !important;
      }
      
      .ql-editor h1 {
        font-size: 2rem !important;
      }
      
      .ql-editor h2 {
        font-size: 1.75rem !important;
        border-bottom: 1px solid #e5e7eb !important;
        padding-bottom: 0.5rem !important;
      }
      
      .ql-editor h3 {
        font-size: 1.5rem !important;
      }
      
      .ql-editor img {
        max-width: 100% !important;
        border-radius: 8px !important;
        margin: 1rem 0 !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
      }
      
      .ql-editor blockquote {
        border-left: 4px solid #6366f1 !important;
        padding: 1rem 1.5rem !important;
        color: #4b5563 !important;
        font-style: italic !important;
        background-color: #f8fafc !important;
        border-radius: 0 0.5rem 0.5rem 0 !important;
        margin: 1.5rem 0 !important;
      }
      
      .ql-editor pre {
        background: #1e293b !important;
        color: #e2e8f0 !important;
        border-radius: 8px !important;
        padding: 16px !important;
        font-family: "Fira Code", Menlo, Monaco, Consolas, "Liberation Mono", monospace !important;
        font-size: 0.875rem !important;
        margin: 1.5rem 0 !important;
      }
      
      .ql-editor code {
        background: #f1f5f9 !important;
        padding: 2px 4px !important;
        border-radius: 4px !important;
        font-family: "Fira Code", Menlo, Monaco, Consolas, "Liberation Mono", monospace !important;
        font-size: 0.875em !important;
        color: #1e293b !important;
      }
      
      .ql-editor ul, .ql-editor ol {
        margin: 1.5rem 0 1.5rem 1.5rem !important;
      }
      
      .ql-editor ul {
        list-style-type: disc !important;
      }
      
      .ql-editor ol {
        list-style-type: decimal !important;
      }
      
      .ql-editor li {
        margin-bottom: 0.5rem !important;
      }
      
      .ql-editor a {
        color: #4f46e5 !important;
        text-decoration: none !important;
        border-bottom: 1px solid transparent !important;
        transition: all 0.2s !important;
      }
      
      .ql-editor a:hover {
        border-bottom: 1px solid #4f46e5 !important;
      }
      
      /* Dark mode styles */
      .dark .ql-toolbar.ql-snow {
        background: #1e293b !important;
        border-bottom: 1px solid #334155 !important;
      }
      
      .dark .ql-container.ql-snow {
        color: #e2e8f0 !important;
      }
      
      .dark .ql-editor {
        color: #e2e8f0 !important;
      }
      
      .dark .ql-editor h1, 
      .dark .ql-editor h2, 
      .dark .ql-editor h3 {
        color: #f7fafc !important;
      }
      
      .dark .ql-editor h2 {
        border-bottom: 1px solid #334155 !important;
      }
      
      .dark .ql-editor img {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1) !important;
      }
      
      .dark .ql-editor blockquote {
        background-color: #1e293b !important;
        color: #a0aec0 !important;
      }
      
      .dark .ql-editor code {
        background: #334155 !important;
        color: #e2e8f0 !important;
      }
      
      .dark .ql-editor a {
        color: #818cf8 !important;
      }
      
      .dark .ql-editor a:hover {
        border-bottom: 1px solid #818cf8 !important;
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
        border-color: #334155 !important;
      }
      
      .dark .ql-snow.ql-toolbar button:hover, 
      .dark .ql-snow .ql-toolbar button:hover, 
      .dark .ql-snow.ql-toolbar button.ql-active, 
      .dark .ql-snow .ql-toolbar button.ql-active, 
      .dark .ql-snow.ql-toolbar .ql-picker-label:hover, 
      .dark .ql-snow .ql-toolbar .ql-picker-label:hover, 
      .dark .ql-snow.ql-toolbar .ql-picker-label.ql-active, 
      .dark .ql-snow .ql-toolbar .ql-picker-label.ql-active, 
      .dark .ql-snow.ql-toolbar .ql-picker-item:hover, 
      .dark .ql-snow .ql-toolbar .ql-picker-item:hover, 
      .dark .ql-snow.ql-toolbar .ql-picker-item.ql-selected, 
      .dark .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
        color: #818cf8 !important;
      }
      
      .dark .ql-snow.ql-toolbar button:hover .ql-stroke, 
      .dark .ql-snow .ql-toolbar button:hover .ql-stroke, 
      .dark .ql-snow.ql-toolbar button.ql-active .ql-stroke, 
      .dark .ql-snow .ql-toolbar button.ql-active .ql-stroke, 
      .dark .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke, 
      .dark .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke, 
      .dark .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, 
      .dark .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, 
      .dark .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke, 
      .dark .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke, 
      .dark .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, 
      .dark .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke {
        stroke: #818cf8 !important;
      }
      
      .dark .ql-snow.ql-toolbar button:hover .ql-fill, 
      .dark .ql-snow .ql-toolbar button:hover .ql-fill, 
      .dark .ql-snow.ql-toolbar button.ql-active .ql-fill, 
      .dark .ql-snow .ql-toolbar button.ql-active .ql-fill, 
      .dark .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill, 
      .dark .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill, 
      .dark .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill, 
      .dark .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill, 
      .dark .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill, 
      .dark .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill, 
      .dark .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill, 
      .dark .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill {
        fill: #818cf8 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);

      // Clean up speech synthesis when component unmounts
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [dispatch]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
    } catch (error) {
      return "không xác định";
    }
  };

  // Validate functions
  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validate title
    if (!postData.title) {
      errors.title = 'Tiêu đề không được để trống';
    } else if (postData.title.length < TITLE_MIN_LENGTH) {
      errors.title = `Tiêu đề phải có ít nhất ${TITLE_MIN_LENGTH} ký tự`;
    } else if (postData.title.length > TITLE_MAX_LENGTH) {
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
    setPostData({
      ...postData,
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

  // Handlers
  const handleEditPost = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.values(validationErrors)[0];
      messageApi.error(firstError || 'Please check your post details');
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('Id', data.post.id);
      formData.append('Content', content || '');
      formData.append('Title', postData.title || '');

      // Add the blogTypeId to the formData
      if (postData.blogTypeId) {
        formData.append('BlogTypeId', postData.blogTypeId.toString());
      }

      // Only append banner if it's a new File object
      if (postData.banner instanceof File) {
        formData.append('Banner', postData.banner);
      }

      const response = await UpdatePost(formData);

      if (response?.statusCode === 200) {
        messageApi.success('Post updated successfully');
        setIsEditing(false);
        router.refresh();
      } else {
        messageApi.error(response?.message || 'Failed to update post');
      }
    } catch (error: any) {
      console.error('Error updating post:', error);
      messageApi.error(error?.message || 'An error occurred while updating the post');
    } finally {
      setIsSaving(false);
    }
  };

  // Get current URL for canonical link
  const getCanonicalUrl = () => {
    if (typeof window !== 'undefined' && data?.post) {
      const slug = generateSlug(data.post.title, data.post.id);
      return `${window.location.origin}/post/${slug}`;
    }
    return '';
  };

  const handleShareFacebook = () => {
    const url = getCanonicalUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setShowShareMenu(false);
  };

  const handleShareTwitter = () => {
    const url = getCanonicalUrl();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${data?.post?.title} - ${url}`)}`, '_blank');
    setShowShareMenu(false);
  };

  const handleShareEmail = () => {
    const url = getCanonicalUrl();
    window.open(`mailto:?subject=${encodeURIComponent(data?.post?.title)}&body=${encodeURIComponent(`Tôi muốn chia sẻ bài viết này với bạn: ${url}`)}`, '_blank');
    setShowShareMenu(false);
  };

  const handleCopyLink = () => {
    const url = getCanonicalUrl();
    navigator.clipboard.writeText(url).then(() => {
      messageApi.success('Đã sao chép liên kết');
      setShowShareMenu(false);
    });
  };

  const handleLike = async () => {
    if (!user) {
      messageApi.warning('Vui lòng đăng nhập để thích bài viết');
      return;
    }

    if (isReactingToPost) return;

    try {
      setIsReactingToPost(true);

      const action = liked ? 'remove' : 'add';
      const response = await reactToPost(data?.post?.id, action);

      if (response.statusCode === 200) {
        // Handle different response types based on the action field in the response
        const { action, hasReacted, reactionCount } = response.data;

        // Only update UI if there was an actual change
        if (action !== 'none') {
          setLiked(hasReacted);

          // Update like count if provided in the response
          if (reactionCount !== undefined) {
            setLikeCount(reactionCount);
          } else {
            // Fallback to incrementing/decrementing
            setLikeCount((prev: number) => hasReacted ? prev + 1 : prev - 1);
          }

          messageApi.success(
            hasReacted
              ? 'Đã thích bài viết'
              : 'Đã bỏ thích bài viết'
          );
        }
      } else {
        messageApi.error(response.message || 'Có lỗi xảy ra khi thực hiện thao tác');
      }
    } catch (error: any) {
      console.error('Failed to react to post:', error);
      messageApi.error(error?.message || 'Không thể thực hiện thao tác. Vui lòng thử lại sau.');
    } finally {
      setIsReactingToPost(false);
    }
  };

  const fetchReactionUsers = async () => {
    if (!data?.post?.id || isLoadingReactions) return;

    try {
      setIsLoadingReactions(true);
      const response = await getPostReactions(data.post.id);

      if (response.statusCode === 200) {
        setReactionUsers(response.data.reactions || []);
        setShowReactionUsers(true);
      } else {
        messageApi.error(response.message || 'Không thể tải danh sách người dùng đã thích bài viết');
      }
    } catch (error: any) {
      console.error('Failed to fetch reaction users:', error);
      messageApi.error(error?.message || 'Không thể tải danh sách người dùng đã thích bài viết');
    } finally {
      setIsLoadingReactions(false);
    }
  };

  // State for bookmark
  const [isBookmarking, setIsBookmarking] = useState(false);

  // Check if post is saved by the user
  useEffect(() => {
    const checkIsSaved = async () => {
      if (!data?.post?.id || !user) return;

      try {
        const response = await isPostSaved(data.post.id);
        if (response.statusCode === 200) {
          setBookmarked(response.data.isSaved);
        }
      } catch (error) {
        console.error('Failed to check if post is saved:', error);
      }
    };

    checkIsSaved();
  }, [data?.post?.id, user]);

  const handleBookmark = async () => {
    if (!user) {
      messageApi.warning('Vui lòng đăng nhập để lưu bài viết');
      return;
    }

    if (isBookmarking) return;

    try {
      setIsBookmarking(true);

      const action = bookmarked ? 'unsave' : 'save';
      const response = await savePost(data?.post?.id, action);

      if (response.statusCode === 200) {
        // Check if there was an actual action (not 'none')
        if (response.data.action !== 'none') {
          setBookmarked(response.data.isSaved);

          messageApi.success(
            response.data.isSaved
              ? 'Đã lưu bài viết'
              : 'Đã bỏ lưu bài viết'
          );
        }
      } else {
        messageApi.error(response.message || 'Có lỗi xảy ra khi thực hiện thao tác');
      }
    } catch (error: any) {
      console.error('Failed to save/unsave post:', error);
      messageApi.error(error?.message || 'Không thể thực hiện thao tác. Vui lòng thử lại sau.');
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Text-to-speech functionality
  const startReading = () => {
    if (!content || typeof window === 'undefined') return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create a temporary div to parse HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Extract text content
    const textToRead = tempDiv.textContent || '';

    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Set language to Vietnamese
    utterance.lang = 'vi-VN';

    // Set voice (optional)
    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(voice => voice.lang === 'vi-VN');
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    // Store reference to the utterance
    speechSynthesisRef.current = utterance;

    // Add event listeners
    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      speechSynthesisRef.current = null;
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
    setIsPaused(false);

    messageApi.success('Bắt đầu đọc bài viết');
  };

  const pauseReading = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeReading = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopReading = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setIsPaused(false);
      speechSynthesisRef.current = null;
    }
  };

  const toggleReading = () => {
    if (isReading) {
      if (isPaused) {
        resumeReading();
      } else {
        pauseReading();
      }
    } else {
      startReading();
    }
  };

  // Load voices when the component mounts
  useEffect(() => {
    const loadVoices = () => {
      // This is just to trigger voice loading
      window.speechSynthesis.getVoices();
    };

    loadVoices();

    // Chrome requires this event listener to load voices
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);
  console.log(data?.types);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {contextHolder}

      {/* Header with glass effect */}
      <div className="relative">
        {/* Background image with overlay */}
        {!isEditing && data?.post?.banner && (
          <div className="absolute inset-0 w-full h-80 overflow-hidden z-0">
            <img
              src={data.post.banner}
              alt=""
              className="w-full h-full object-cover opacity-30 dark:opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-700/80 to-purple-900/80 dark:from-indigo-900/90 dark:to-purple-950/90 mix-blend-multiply"></div>
          </div>
        )}

        {/* Default background when no banner */}
        {(!data?.post?.banner || isEditing) && (
          <div className="absolute inset-0 w-full h-80 overflow-hidden z-0 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-900">
            <div className="absolute inset-0 opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
                <path fill="rgba(255,255,255,0.2)" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,154.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </div>
        )}

        {/* Content with glass effect */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-12 md:items-center md:justify-between">
              <div className="flex-1">
                <button
                  onClick={handleGoBack}
                  className="flex items-center mb-4 text-white/80 hover:text-white group transition-colors"
                >
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 mr-2 transition-colors">
                    <FiArrowLeft className="text-white" />
                  </span>
                  <span className="font-medium">Quay lại</span>
                </button>

                {isEditing ? (
                  <input
                    value={postData.title}
                    onChange={handleTitleChange}
                    type="text"
                    placeholder="Tiêu đề bài viết..."
                    className={`w-full text-3xl md:text-4xl font-bold text-white bg-transparent focus:outline-none ${errors.title ? 'border-b-2 border-red-500' : ''}`}
                  />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{data?.post?.title}</h1>
                )}

                {isEditing && (
                  <div className="flex justify-between items-center mt-2">
                    {errors.title ? (
                      <p className="text-red-300 text-sm">{errors.title}</p>
                    ) : (
                      <p className={`text-sm ${postData.title.length > 0 && postData.title.length < TITLE_MIN_LENGTH
                        ? 'text-amber-300'
                        : 'text-white/70'
                        }`}>
                        {postData.title.length}/{TITLE_MAX_LENGTH} ký tự
                      </p>
                    )}
                  </div>
                )}

                {!isEditing && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link href={`/profile/${data?.user?.id}`} className="flex items-center group bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-full px-3 py-1.5 hover:bg-white/20 transition-colors">
                      <img
                        src={data?.user?.avatar || "https://placehold.co/200/indigo/white?text=User"}
                        alt={data?.user?.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/30"
                      />
                      <span className="ml-2 text-white group-hover:text-white transition-colors font-medium">
                        {data?.user?.name}
                      </span>
                    </Link>

                    <div className="flex items-center text-white/70 text-sm bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <FiEye className="mr-1.5" />
                      <span className="font-medium">{readingTime} phút đọc</span>
                    </div>

                    <div className="flex items-center text-white/70 text-sm bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <FiEye className="mr-1.5" />
                      <span className="font-medium">{data?.post?.countView || 0} lượt xem</span>
                    </div>

                    <div className="text-white/70 text-sm bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                      {formatDate(data?.post?.updatedAt)}
                    </div>

                    <button
                      onClick={toggleReading}
                      className="flex items-center text-white/70 text-sm bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-full px-3 py-1.5 hover:bg-white/20 transition-colors"
                      title={isReading ? (isPaused ? "Tiếp tục đọc" : "Tạm dừng đọc") : "Đọc bài viết"}
                    >
                      {isReading ? (
                        isPaused ? <FaVolumeUp /> : <FaVolumeMute />
                      ) : (
                        <FaVolumeUp />
                      )}
                      <span className="font-medium">
                        {isReading
                          ? (isPaused ? "Tiếp tục đọc" : "Tạm dừng")
                          : "Đọc bài viết"}
                      </span>
                    </button>

                    {isReading && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={stopReading}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                      >
                        <FiX />
                        <span className="font-medium">Dừng</span>
                      </motion.button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 md:mt-0 flex space-x-3">
                {user?.id === data?.user?.id && (
                  <Button
                    onClick={handleEditPost}
                    type={isEditing ? "success" : "secondary"}
                    className={`px-5 py-2.5 text-sm ${isEditing ? "" : "bg-white/20 backdrop-blur-sm border-transparent text-white hover:bg-white/30"}`}
                    icon={isEditing ? (isSaving ? null : <FiCheckCircle />) : <FiEdit />}
                    disabled={isSaving}
                  >
                    {isEditing
                      ? (isSaving
                        ? <div className="flex items-center">
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Đang lưu...
                        </div>
                        : 'Lưu thay đổi')
                      : 'Chỉnh sửa'}
                  </Button>
                )}
                {isEditing && (
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setContent(data?.post?.content || '');
                      setPostData({
                        title: data?.post?.title || '',
                        banner: data?.post?.banner || null,
                      });
                      setErrors({});
                    }}
                    type="secondary"
                    className="px-5 py-2.5 text-sm bg-white/20 backdrop-blur-sm border-transparent text-white hover:bg-white/30"
                    icon={<FiX />}
                  >
                    Hủy
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Head>
        <title>{data?.post?.title} - Blog</title>
        <meta name="description" content={data?.post?.content} />
        <meta name="keywords" content={data?.post?.tags} />
        <meta name="author" content={data?.user?.name} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={getCanonicalUrl()} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 top-10 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              {/* Editor/Preview tabs */}
              {isEditing && (
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
              )}

              {/* Editor/Preview content */}
              <div className="p-0">
                {isEditing && activeTab === 'editor' ? (
                  <div className="rounded-lg overflow-hidden relative">
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
                ) : isEditing && activeTab === 'preview' ? (
                  <div className="min-h-[60vh] p-6 prose dark:prose-invert max-w-none">
                    {content ? (
                      <>
                        <h1>{postData.title || 'Tiêu đề bài viết'}</h1>
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
                ) : (
                  <div className="p-0">
                    {/* Article content */}
                    <article ref={contentRef} className="post-content">
                      <style jsx global>{`
                        .post-content {
                          color: #1a202c;
                          font-size: 1.125rem;
                          line-height: 1.8;
                          overflow-wrap: break-word;
                        }
                        
                        .dark .post-content {
                          color: #e2e8f0;
                        }
                        
                        .post-content > div {
                          padding: 2rem;
                        }
                        
                        .post-content img {
                          max-width: 100%;
                          height: auto;
                          border-radius: 0.5rem;
                          margin: 1.5rem 0;
                          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        }
                        
                        .post-content h1, 
                        .post-content h2, 
                        .post-content h3,
                        .post-content h4,
                        .post-content h5,
                        .post-content h6 {
                          font-weight: 700;
                          line-height: 1.3;
                          margin-top: 2rem;
                          margin-bottom: 1rem;
                          color: #1a202c;
                        }
                        
                        .dark .post-content h1,
                        .dark .post-content h2,
                        .dark .post-content h3,
                        .dark .post-content h4,
                        .dark .post-content h5,
                        .dark .post-content h6 {
                          color: #f7fafc;
                        }
                        
                        .post-content h1 {
                          font-size: 2.25rem;
                        }
                        
                        .post-content h2 {
                          font-size: 1.875rem;
                          border-bottom: 1px solid #e2e8f0;
                          padding-bottom: 0.5rem;
                        }
                        
                        .dark .post-content h2 {
                          border-bottom: 1px solid #2d3748;
                        }
                        
                        .post-content h3 {
                          font-size: 1.5rem;
                        }
                        
                        .post-content p {
                          margin-bottom: 1.5rem;
                        }
                        
                        .post-content a {
                          color: #4f46e5;
                          text-decoration: none;
                          transition: all 0.2s;
                          border-bottom: 1px solid transparent;
                        }
                        
                        .post-content a:hover {
                          border-bottom: 1px solid #4f46e5;
                        }
                        
                        .dark .post-content a {
                          color: #818cf8;
                        }
                        
                        .dark .post-content a:hover {
                          border-bottom: 1px solid #818cf8;
                        }
                        
                        .post-content blockquote {
                          margin: 1.5rem 0;
                          padding: 1rem 1.5rem;
                          border-left: 4px solid #6366f1;
                          background-color: #f8fafc;
                          color: #4a5568;
                          font-style: italic;
                          border-radius: 0 0.5rem 0.5rem 0;
                        }
                        
                        .dark .post-content blockquote {
                          background-color: #1e293b;
                          color: #a0aec0;
                        }
                        
                        .post-content pre {
                          background: #1e293b;
                          color: #e2e8f0;
                          padding: 1.25rem;
                          border-radius: 0.5rem;
                          overflow-x: auto;
                          margin: 1.5rem 0;
                          font-family: "Fira Code", Menlo, Monaco, Consolas, "Liberation Mono", monospace;
                          font-size: 0.875rem;
                        }
                        
                        .post-content code {
                          font-family: "Fira Code", Menlo, Monaco, Consolas, "Liberation Mono", monospace;
                          background: #f1f5f9;
                          color: #1e293b;
                          padding: 0.2rem 0.4rem;
                          border-radius: 0.25rem;
                          font-size: 0.875em;
                        }
                        
                        .dark .post-content code {
                          background: #334155;
                          color: #e2e8f0;
                        }
                        
                        .post-content pre code {
                          background: transparent;
                          padding: 0;
                          color: inherit;
                        }
                        
                        .post-content ul, 
                        .post-content ol {
                          margin: 1.5rem 0 1.5rem 1.5rem;
                        }
                        
                        .post-content ul {
                          list-style-type: disc;
                        }
                        
                        .post-content ol {
                          list-style-type: decimal;
                        }
                        
                        .post-content li {
                          margin-bottom: 0.5rem;
                        }
                        
                        .post-content table {
                          width: 100%;
                          border-collapse: collapse;
                          margin: 1.5rem 0;
                        }
                        
                        .post-content table th,
                        .post-content table td {
                          border: 1px solid #e2e8f0;
                          padding: 0.75rem;
                          text-align: left;
                        }
                        
                        .dark .post-content table th,
                        .dark .post-content table td {
                          border-color: #2d3748;
                        }
                        
                        .post-content table th {
                          background-color: #f8fafc;
                          font-weight: 600;
                        }
                        
                        .dark .post-content table th {
                          background-color: #1e293b;
                        }
                        .post-content p {
                          text-align: justify;
                        }
                        .post-content hr {
                          border: 0;
                          height: 1px;
                          background-color: #e2e8f0;
                          margin: 2rem 0;
                        }
                        
                        .dark .post-content hr {
                          background-color: #2d3748;
                        }
                      `}</style>
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    </article>
                  </div>
                )}
              </div>

              {/* Post footer with reading controls */}
              {!isEditing && (
                <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${liked
                          ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        disabled={isReactingToPost}
                      >
                        {isReactingToPost ? (
                          <div className="w-4 h-4 border-2 border-current rounded-full animate-spin border-t-transparent" />
                        ) : liked ? (
                          <FaHeart className="text-rose-600 dark:text-rose-400" />
                        ) : (
                          <FaRegHeart />
                        )}
                        <span className="font-medium">{liked ? 'Đã thích' : 'Thích'}</span>
                        {likeCount > 0 && (
                          <span className="ml-1 bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded-full text-xs font-medium">
                            {likeCount}
                          </span>
                        )}
                      </motion.button>

                      {likeCount > 0 && (
                        <div className="relative">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={fetchReactionUsers}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            disabled={isLoadingReactions}
                          >
                            {isLoadingReactions ? 'Đang tải...' : 'Xem ai đã thích'}
                          </motion.button>

                          {showReactionUsers && (
                            <div
                              ref={reactionMenuRef}
                              className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64 py-2 z-10"
                            >
                              <div className="px-3 py-1 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="font-medium text-sm">Người đã thích</h3>
                                <button
                                  onClick={() => setShowReactionUsers(false)}
                                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                  <FiX size={16} />
                                </button>
                              </div>
                              <div className="max-h-60 overflow-y-auto py-1">
                                {reactionUsers.length > 0 ? (
                                  reactionUsers.map((user) => (
                                    <Link
                                      href={`/profile/${user.userId}`}
                                      key={user.userId}
                                      className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <img
                                        src={user.userAvatar || "https://placehold.co/200/indigo/white?text=User"}
                                        alt={user.userName}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                      />
                                      <div className="ml-2">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                          {user.userName}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          {formatDate(user.heartDay)}
                                        </div>
                                      </div>
                                    </Link>
                                  ))
                                ) : (
                                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                    Không có người dùng nào đã thích bài viết này
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FiMessageSquare />
                        <span className="font-medium">Bình luận</span>
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleReading}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isReading
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                      >
                        {isReading ? (
                          isPaused ? <FaVolumeUp /> : <FaVolumeMute />
                        ) : (
                          <FaVolumeUp />
                        )}
                        <span className="font-medium">
                          {isReading
                            ? (isPaused ? "Tiếp tục đọc" : "Tạm dừng")
                            : "Đọc bài viết"}
                        </span>
                      </motion.button>

                      {isReading && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={stopReading}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                        >
                          <FiX />
                          <span className="font-medium">Dừng</span>
                        </motion.button>
                      )}

                      <div className="relative" ref={shareMenuRef}>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowShareMenu(!showShareMenu)}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <FiShare2 />
                          <span className="font-medium">Chia sẻ</span>
                        </motion.button>

                        {showShareMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-56 py-2 z-10"
                          >
                            <div className="px-2 mb-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                              Chia sẻ qua
                            </div>
                            <button
                              onClick={handleShareFacebook}
                              className="flex items-center w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              <FaFacebook className="text-blue-600 mr-2" />
                              <span>Facebook</span>
                            </button>
                            <button
                              onClick={handleShareTwitter}
                              className="flex items-center w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              <FaTwitter className="text-blue-400 mr-2" />
                              <span>Twitter</span>
                            </button>
                            <button
                              onClick={handleShareEmail}
                              className="flex items-center w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              <MdEmail className="text-red-500 mr-2" />
                              <span>Email</span>
                            </button>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                            <button
                              onClick={handleCopyLink}
                              className="flex items-center w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              <FiCopy className="text-gray-600 dark:text-gray-400 mr-2" />
                              <span>Sao chép liên kết</span>
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBookmark}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${bookmarked
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      disabled={isBookmarking}
                    >
                      {isBookmarking ? (
                        <div className="w-4 h-4 border-2 border-current rounded-full animate-spin border-t-transparent" />
                      ) : bookmarked ? (
                        <FiBookmark className="fill-current" />
                      ) : (
                        <FiBookmark />
                      )}
                      <span className="font-medium">{bookmarked ? 'Đã lưu' : 'Lưu bài viết'}</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Comments section - only show when not editing */}
            {!isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FiMessageSquare className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  Bình luận
                </h2>

                {/* Comment form */}
                <div className="flex items-start space-x-4 mb-8">
                  <img
                    src={user?.avatar || "https://placehold.co/200/indigo/white?text=User"}
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  />
                  <div className="flex-1">
                    <textarea
                      placeholder="Viết bình luận của bạn..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px] resize-y"
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <Button
                        className="px-4 py-2 text-sm"
                      >
                        Gửi bình luận
                      </Button>
                    </div>
                  </div>
                </div>

                {/* No comments placeholder */}
                <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <FiMessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-lg font-medium">Chưa có bình luận nào</p>
                  <p className="mt-1 text-sm">Hãy là người đầu tiên bình luận về bài viết này</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            {/* Edit settings */}
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 sticky top-24"
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiEdit className="mr-2 text-indigo-600 dark:text-indigo-400" />
                    Thiết lập bài viết
                  </h3>

                  {/* Show any validation errors */}
                  {Object.keys(errors).length > 0 && (
                    <Alert
                      message="Vui lòng sửa các lỗi sau trước khi lưu"
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

                  {/* Blog type selector */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <FiTag className="mr-2 text-indigo-600 dark:text-indigo-400" />
                      Loại bài viết
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Chọn loại bài viết"
                        value={postData.blogTypeId}
                        onChange={(value) => setPostData({ ...postData, blogTypeId: value })}
                        options={data?.types?.map((type: any) => ({
                          value: type.id,
                          label: type.name,
                        }))}
                      />
                    </div>
                  </div>

                  {/* Banner upload */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <FiImage className="mr-2 text-indigo-600 dark:text-indigo-400" />
                      Ảnh bìa bài viết
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <Banner data={postData.banner} setData={setPostData} />
                    </div>
                  </div>

                  {/* Submit button */}
                  <Button
                    onClick={handleEditPost}
                    disabled={isSaving}
                    type={Object.keys(errors).length > 0 ? "secondary" : "success"}
                    className="w-full mt-6 py-3 text-base"
                    icon={<FiCheck />}
                  >
                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Author info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white pt-12 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100 dark:border-gray-700 sticky top-24"
                >


                  <div className="p-6 -mt-12">
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative">
                        <img
                          src={data?.user?.avatar || "https://placehold.co/200/indigo/white?text=User"}
                          alt={data?.user?.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800"
                        />
                        {data?.user?.roleId === 2 && (
                          <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1.5 border-2 border-white dark:border-gray-800">
                            <FiCheckCircle className="text-white w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {data?.user?.name}
                        </h3>
                        {data?.user?.roleId === 2 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 mt-1">
                            <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 8 8">
                              <circle cx="4" cy="4" r="3" />
                            </svg>
                            Admin
                          </span>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Tham gia từ {formatDate(data?.user?.createdAt || new Date().toString())}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                          <FiEdit className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm">Số bài viết: <span className="font-semibold text-gray-700 dark:text-gray-200">12</span></span>
                      </div>

                      <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                          <FiHeart className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm">Lượt thích: <span className="font-semibold text-gray-700 dark:text-gray-200">240</span></span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <Button
                        type="primary"
                        className="w-full py-2.5 text-sm"
                        onClick={() => router.push(`/profile/${data?.user?.id}`)}
                      >
                        Xem trang cá nhân
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Table of contents */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100 dark:border-gray-700 sticky top-80"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center border-b border-gray-100 dark:border-gray-700 pb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                      </svg>
                      Mục lục
                    </h3>

                    <div className="space-y-2 text-gray-600 dark:text-gray-300">
                      {tableOfContents.length > 0 ? (
                        tableOfContents.map((item, index) => (
                          <button
                            key={item.id}
                            onClick={() => scrollToHeading(item.id)}
                            className={`block text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left w-full truncate
                              ${item.level === 1 ? 'font-medium' : ''}
                              ${item.level > 1 ? `pl-${item.level * 2}` : ''}`}
                            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                          >
                            {index + 1}. {item.text}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500 italic">Không có mục lục cho bài viết này</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Share card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <FiShare2 className="mr-2 text-indigo-600 dark:text-indigo-400" />
                      Chia sẻ bài viết
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleShareFacebook}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <FaFacebook className="text-lg" />
                        <span className="font-medium">Facebook</span>
                      </button>

                      <button
                        onClick={handleShareTwitter}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-400 text-white hover:bg-blue-500 transition-colors"
                      >
                        <FaTwitter className="text-lg" />
                        <span className="font-medium">Twitter</span>
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        onClick={handleShareEmail}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        <MdEmail className="text-lg" />
                        <span className="font-medium">Email</span>
                      </button>

                      <button
                        onClick={handleCopyLink}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FiCopy className="text-lg" />
                        <span className="font-medium">Sao chép</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default PostById;
