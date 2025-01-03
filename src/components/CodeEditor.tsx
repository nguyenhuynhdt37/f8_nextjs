import React, { useEffect, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import 'prismjs/components/prism-typescript';
import 'prism-themes/themes/prism-coldark-cold.css';
import { log } from 'console';
const CodeEditor: React.FC<any> = ({
  height = '400px',
  defaultLanguage,
  defaultValue,
  editorRef,
  setMonacoInstance,
  setIsBlur,
  isBlur,
  setCode,
}) => {
  useEffect(() => {
    loader.init().then(monaco => setMonacoInstance(monaco));
  }, []);
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    editor.updateOptions({
      autoIndent: 'full',
      suggestOnTriggerCharacters: true,
      wordBasedSuggestions: true,
      quickSuggestions: { other: true, comments: true, strings: true },
      parameterHints: { enabled: true },
    });

    // Sự kiện mất focus
    editor.onDidBlurEditorText(async () => {
      setIsBlur(isBlur + 1);
    });
  };
  const handleOnchange = (value: string | undefined) => {
    setCode(value || '');
  };
  return (
    <div className="code-editor">
      <Editor
        height={height}
        theme="vs-dark"
        defaultLanguage={defaultLanguage}
        defaultValue={defaultValue || ''}
        onChange={handleOnchange}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
        }}
      />
    </div>
  );
};

export default CodeEditor;
