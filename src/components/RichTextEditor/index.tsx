// components/CombinedEditor.tsx
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/monokai-sublime.css";
const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: any;
}) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      className="custom-quill  text-[3rem] border-[#ffffff] overflow-hidden border-2 rounded-lg min-h-[20rem] max-h-[45rem] scrollbar-custom"
      theme="snow"
      style={{ padding: "0px" }}
      placeholder="Viết văn bản ở đây..."
      modules={{
        toolbar: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          ["link", "image"],
          ["clean"],
          ["code-block"],
        ],
      }}
      formats={[
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "background",
        "align",
        "code-block",
      ]}
    />
  );
};

export default RichTextEditor;
