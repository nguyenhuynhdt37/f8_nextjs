import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
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
  }, [code]);

  return (
    <div className="rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <pre className="p-4 overflow-x-auto">
        <code className="language-js text-sm md:text-base">{cleanCode(code)}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
