import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadImage } from '@/api/axios/api';
import { v4 as uuidv4 } from 'uuid';

interface ReactQuillEditorCommentProps {
  comment: string;
  setComment: (content: string) => void;
  height?: string;
  onImageUploadError?: (error: string) => void;
}

// Định nghĩa kiểu RangeStatic để tránh lỗi TypeScript
interface RangeStatic {
  index: number;
  length: number;
}

const ReactQuillEditorComment: React.FC<ReactQuillEditorCommentProps> = ({
  comment,
  setComment,
  height = '200px',
  onImageUploadError
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Tạo hàm xử lý upload ảnh
  const imageHandler = () => {
    // Tạo input file ẩn
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/jpg');
    input.click();

    // Xử lý khi chọn file
    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return;
      const file = input.files[0];

      // Kiểm tra kích thước tệp
      if (file.size > 5 * 1024 * 1024) {
        const errorMsg = 'Tệp quá lớn (giới hạn 5MB)';
        console.error(errorMsg);
        if (onImageUploadError) onImageUploadError(errorMsg);
        return;
      }

      // Kiểm tra loại tệp
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        const errorMsg = 'Loại tệp không được hỗ trợ, chỉ chấp nhận JPEG, PNG, GIF';
        console.error(errorMsg);
        if (onImageUploadError) onImageUploadError(errorMsg);
        return;
      }

      try {
        setIsUploading(true);

        // Tạo UUID để đặt tên file ngẫu nhiên
        const uuid = uuidv4();
        const fileNameRandom = uuid.replace(/-/g, '').slice(0, 16);
        const fileExtension = file.name.split('.').pop() || '';
        const newFileName = `${fileNameRandom}.${fileExtension}`;

        // Tạo file mới với tên đã được mã hóa
        const renamedFile = new File([file], newFileName, { type: file.type });

        // Tạo FormData chỉ với trường avatar
        const formData = new FormData();
        formData.append('avatar', renamedFile);

        console.log('Uploading file:', newFileName, 'size:', file.size, 'type:', file.type);

        // Gọi API upload ảnh
        const res = await uploadImage(formData);
        console.log('Upload response:', JSON.stringify(res));

        if (res?.statusCode === 200 || res?.statusCode === 201) {
          // Xác định URL của ảnh từ response
          let imageUrl = null;

          if (res.data?.url) {
            imageUrl = res.data.url;
          } else if (res.data?.avatarUrl) {
            imageUrl = res.data.avatarUrl;
          } else if (typeof res.data === 'string') {
            imageUrl = res.data;
          }

          if (imageUrl && quillRef.current) {
            // Lấy vị trí con trỏ hiện tại
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection() || { index: 0, length: 0 };

            // Chèn ảnh vào vị trí con trỏ
            quill.insertEmbed(range.index, 'image', imageUrl);
            // Di chuyển con trỏ sau ảnh
            quill.setSelection(range.index + 1, 0);
          } else {
            throw new Error('Không thể xác định URL ảnh');
          }
        } else {
          throw new Error(res?.message || 'Lỗi khi tải lên ảnh');
        }
      } catch (error: any) {
        const errorMsg = error?.message || 'Lỗi không xác định khi tải ảnh';
        console.error('Image upload error:', errorMsg);
        if (onImageUploadError) onImageUploadError(errorMsg);
      } finally {
        setIsUploading(false);
      }
    };
  };

  // Cấu hình modules cho ReactQuill
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: ['center', 'right', 'justify'] }],
        [{ color: [] }, { background: [] }],
        ['link', 'image', 'code-block'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    },
  };

  return (
    <div className="quill-editor-container">
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
          <div className="text-blue-500">Đang tải ảnh lên...</div>
        </div>
      )}
      <ReactQuill
        ref={quillRef}
        value={comment}
        onChange={setComment}
        className="border border-gray-300 rounded-lg overflow-hidden"
        theme="snow"
        placeholder="Viết văn bản ở đây..."
        modules={modules}
        formats={[
          'header',
          'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'bullet',
          'link', 'image', 'color', 'background', 'align',
          'code-block',
        ]}
        style={{
          height: height,
        }}
      />
    </div>
  );
};

export default ReactQuillEditorComment;
