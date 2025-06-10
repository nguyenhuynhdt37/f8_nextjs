import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prism-themes/themes/prism-coldark-cold.css';

interface CodeBlockProps {
  code: string;
}

const cleanCode = (code: string): string => {
  const div = document.createElement('div');
  div.innerHTML = code;
  return div.textContent || div.innerText || '';
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code }: CodeBlockProps) => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre className=" rounded-2xl bg-[#f2f9ff] p-10">
      <code className="language-ts text-2xl">{cleanCode(code)}</code>
    </pre>
  );
};

export default CodeBlock;
