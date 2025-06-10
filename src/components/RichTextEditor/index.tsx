// components/CombinedEditor.tsx
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/monokai-sublime.css';
import { uploadImage } from '@/api/axios/api';
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useEffect, useRef, useState } from 'react';
import './editor.css';
import { FiImage, FiCode, FiLink, FiType, FiList, FiAlignLeft } from 'react-icons/fi';

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: any;
}) => {
  const quillRef = useRef<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for dark mode preference
  useEffect(() => {
    // Check initial preference
    const checkDarkMode = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const generateRandomFileName = (): string => {
    // Tạo UUID v4
    const uuid = uuidv4();
    const randomName = uuid.replace(/-/g, '').slice(0, 16);
    return randomName;
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 5MB.');
          return;
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          alert('Loại tệp không được hỗ trợ. Vui lòng chọn ảnh dạng JPEG, PNG hoặc GIF.');
          return;
        }

        // Rename file with random name
        const fileNameRandom = generateRandomFileName();
        const fileExtension = file.name.split('.').pop();
        const newFileName = `${fileNameRandom}.${fileExtension}`;
        const renamedFile = new File([file], newFileName, { type: file.type });

        // Create FormData with multiple field names to handle different API expectations
        const formData = new FormData();
        formData.append('avatar', renamedFile); // lowercase as used in most places
        formData.append('Avatar', renamedFile); // capitalized as in UpdateUserRequest
        formData.append('File', renamedFile); // As used in UploadDto

        try {
          console.log('Uploading image...', {
            fileName: newFileName,
            fileSize: file.size,
            fileType: file.type
          });

          const res = await uploadImage(formData);
          console.log('Upload response:', JSON.stringify(res, null, 2));

          // Successfully uploaded image
          if (res?.statusCode === 200 || res?.statusCode === 201) {
            // Determine image URL from various possible response formats
            let imageUrl = null;

            // Check different possible URL locations in the response
            if (res.data?.url) {
              imageUrl = res.data.url;
              console.log('Found URL in res.data.url:', imageUrl);
            } else if (res.data?.avatarUrl) {
              imageUrl = res.data.avatarUrl;
              console.log('Found URL in res.data.avatarUrl:', imageUrl);
            } else if (typeof res.data === 'string' && res.data.includes('http')) {
              imageUrl = res.data;
              console.log('Found URL in res.data string:', imageUrl);
            }

            if (imageUrl) {
              if (quillRef.current) {
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection(true);
                console.log('Inserting image at position:', range.index);
                quill.insertEmbed(range.index, 'image', imageUrl);
              } else {
                console.error('Quill editor reference not available');
                alert('Không thể chèn hình ảnh vào trình soạn thảo.');
              }
            } else {
              console.error('No valid image URL found in response:', res);
              alert('Không thể tải lên hình ảnh. URL không hợp lệ.');
            }
          } else {
            console.error('Error uploading image. Response:', res);
            alert(`Không thể tải lên hình ảnh. Lỗi: ${res?.message || 'Không rõ lỗi'}`);
          }
        } catch (error) {
          console.error('Exception uploading image:', error);
          alert('Có lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại sau.');
        }
      }
    };
  }, []);

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

  return (
    <div className={`f8-editor-wrapper ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="f8-editor-container">
        <div className="f8-editor-toolbar-hints">
          <div className="toolbar-hint">
            <FiType className="hint-icon" />
            <span>Định dạng</span>
          </div>
          <div className="toolbar-hint">
            <FiList className="hint-icon" />
            <span>Danh sách</span>
          </div>
          <div className="toolbar-hint">
            <FiAlignLeft className="hint-icon" />
            <span>Căn chỉnh</span>
          </div>
          <div className="toolbar-hint">
            <FiImage className="hint-icon" />
            <span>Hình ảnh</span>
          </div>
          <div className="toolbar-hint">
            <FiLink className="hint-icon" />
            <span>Liên kết</span>
          </div>
          <div className="toolbar-hint">
            <FiCode className="hint-icon" />
            <span>Mã nguồn</span>
          </div>
        </div>
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={onChange}
          theme="snow"
          placeholder="Viết văn bản ở đây..."
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
      </div>
      <div className="f8-editor-footer">
        <div className="editor-status">
          <span className="status-indicator"></span>
          {isDarkMode ? 'Chế độ tối' : 'Chế độ sáng'}
        </div>
        <div className="editor-tips">
          Nhấn <kbd>/</kbd> để mở menu lệnh nhanh
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
