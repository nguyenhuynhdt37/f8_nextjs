import React, { useRef, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import * as esprima from "esprima";
import { log } from "node:console";

const CodeEditor = () => {
  const editorRef = useRef<any>(null);
  const [errors, setErrors] = useState<string[]>([]); // Lưu danh sách lỗi

  // Lưu instance của Monaco Editor khi render xong
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Kiểm tra lỗi cú pháp khi submit
  const handleCheckSyntax = () => {
    const code: any = editorRef.current.getValue();
    const markers: any[] = [];
    const errorMessages: string[] = [];

    try {
      // Phân tích code, sẽ ném lỗi nếu sai cú pháp
      esprima.parseScript(code);
    } catch (error: any) {
      console.log(error);

      const { lineNumber, column, description } = error;

      // Đánh dấu lỗi trên Monaco Editor
      markers.push({
        startLineNumber: lineNumber,
        startColumn: column,
        endLineNumber: lineNumber,
        endColumn: column + 1,
        message: description,
        severity: monaco.MarkerSeverity.Error, // Mức độ nghiêm trọng
      });

      // Thêm lỗi vào danh sách để hiển thị
      errorMessages.push(
        `Line ${lineNumber}, Column ${column}: ${description}`
      );
    }

    // Đặt markers để Monaco Editor hiển thị lỗi
    monaco.editor.setModelMarkers(
      editorRef.current.getModel(),
      "owner", // Tên bộ marker (tùy chọn)
      markers
    );

    // Cập nhật state hiển thị lỗi
    setErrors(errorMessages);
  };

  return (
    <div className="grid h-[90.3vh] grid-cols-2 text-[1.4rem]">
      <div className=""></div>
      <div className="border-s-[0.1rem]">
        {/* Monaco Editor */}
        <Editor
          height="600px"
          theme="vs-dark"
          className="text-[1.4rem]"
          defaultLanguage="javascript"
          defaultValue="// Viết code của bạn ở đây..."
          onMount={handleEditorDidMount}
        />
        {/* Nút Submit */}
        <div className="flex py-5 text-[1.5rem] px-5 border-b-[0.1rem] items-center justify-between">
          <div className="">Bài kiểm tra (1/2)</div>
          <button
            onClick={handleCheckSyntax}
            className="rounded-full px-10 py-3 bg-[#3490c9] text-[#fff]"
          >
            Kiểm tra
          </button>
        </div>

        {/* Hiển thị thông báo lỗi */}
        {errors.length > 0 && (
          <div className="p-10 text-[1.5rem]">
            <ul className="p-10 rounded-2xl bg-[#f2f9ff]">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
