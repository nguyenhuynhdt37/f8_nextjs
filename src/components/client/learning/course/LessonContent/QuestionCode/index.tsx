import React, { useState } from "react";
import { MonacoEditor } from "@monaco-editor/react";
// import "monaco-editor-suggest/dist/index.js";

const TestJavaScript: React.FC = () => {
  const [jsCode, setJsCode] = useState(
    "// Viết mã JS ở đây\nconsole.log('Hello, World!');"
  );
  const [output, setOutput] = useState<string>("");

  const executeCode = () => {
    try {
      const consoleOutput: string[] = [];
      const customConsole = {
        log: (...args: any[]) => consoleOutput.push(args.join(" ")),
      };

      const wrappedCode = `
        (function(console) {
          ${jsCode}
        })(customConsole);
      `;

      // Thực thi mã
      // eslint-disable-next-line no-new-func
      new Function("customConsole", wrappedCode)(customConsole);

      setOutput(consoleOutput.join("\n"));
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>JavaScript Code Tester</h2>
      <MonacoEditor
        height="200px"
        language="javascript"
        theme="vs-dark"
        value={jsCode}
        onChange={(newCode: any) => setJsCode(newCode)}
        // Kích hoạt gợi ý code
        onMount={(editor) => {
          monaco.languages.registerCompletionItemProvider("javascript", {
            provideCompletionItems: (model, position) => {
              return {
                suggestions: [
                  {
                    label: "console.log",
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: "console.log($1);",
                  },
                  // ... thêm các gợi ý khác
                ],
              };
            },
          });
        }}
      />
      <button
        onClick={executeCode}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007acc",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Run Code
      </button>
      <h3>Output:</h3>
      <pre
        style={{
          backgroundColor: "#f4f4f4",
          padding: "10px",
          borderRadius: "4px",
          minHeight: "100px",
        }}
      >
        {output}
      </pre>
    </div>
  );
};

export default TestJavaScript;
