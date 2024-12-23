import React from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { uploadImage } from "@/api/api";
// Khởi tạo parser Markdown
const mdParser = new MarkdownIt();

const MarkdownEditor = ({ value, onChange, height = "400px" }: any) => {
  // Hàm xử lý khi nội dung thay đổi
  const handleEditorChange = ({ text }: any) => {
    if (onChange) onChange(text);
  };
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await uploadImage(formData);

    if (res?.statusCode === 200 || res?.statusCode === 201) {
      return res?.data?.url;
    } else {
      return "";
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
