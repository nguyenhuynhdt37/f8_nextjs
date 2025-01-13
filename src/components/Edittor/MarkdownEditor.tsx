import React from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { uploadImage } from '@/api/api';
import { v4 as uuidv4 } from 'uuid';
// Khởi tạo parser Markdown
const mdParser = new MarkdownIt();

const MarkdownEditor = ({ value, onChange, height = '400px' }: any) => {
  // Hàm xử lý khi nội dung thay đổi
  const handleEditorChange = ({ text }: any) => {
    if (onChange) onChange(text);
  };
  function generateRandomPassword(): string {
    // Tạo UUID v4
    const uuid = uuidv4();
    const password = uuid.replace(/-/g, '').slice(0, 16);

    return password;
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();

    // Mã hóa tên file
    const fileNameRandom = generateRandomPassword();
    const fileExtension = file.name.split('.').pop();
    const newFileName = `${fileNameRandom}.${fileExtension}`;
    const renamedFile = new File([file], newFileName, { type: file.type });

    formData.append('avatar', renamedFile);
    const res = await uploadImage(formData);

    if (res?.statusCode === 200 || res?.statusCode === 201) {
      return res?.data?.url;
    } else {
      return '';
    }
  };

  return (
    <MdEditor
      className="mdEdit-customize"
      value={value}
      style={{ height }}
      renderHTML={(text: string) => mdParser.render(text)}
      onChange={handleEditorChange}
      onImageUpload={handleImageUpload}
    />
  );
};

export default MarkdownEditor;
