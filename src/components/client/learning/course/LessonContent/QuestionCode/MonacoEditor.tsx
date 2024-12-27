// MonacoEditor.tsx
import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  language: string;
  theme: string;
  onChange?: (newValue: string) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language,
  theme,
  onChange,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = monaco.editor.create(editorRef.current, {
        value: value,
        language: language,
        theme: theme,
      });

      // Đăng ký sự kiện khi nội dung thay đổi
      editor.onDidChangeModelContent(() => {
        const newValue = editor.getValue();
        if (onChange) {
          onChange(newValue);
        }
      });
    }

    return () => {
      if (editorRef.current) {
        monaco.editor.getModels().forEach(model => model.dispose());
      }
    };
  }, [value, language, theme, onChange]);

  return <div ref={editorRef} style={{ width: '100%', height: '600px' }} />;
};

export default MonacoEditor;
