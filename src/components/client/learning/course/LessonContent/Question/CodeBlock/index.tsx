import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prism-themes/themes/prism-coldark-cold.css';
import 'prism-themes/themes/prism-coldark-dark.css';
import { FiCopy, FiCheck, FiCode, FiMaximize, FiMinimize } from 'react-icons/fi';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const cleanCode = (code: string): string => {
  const div = document.createElement('div');
  div.innerHTML = code;
  return div.textContent || div.innerText || '';
};

// Function to detect language from code
const detectLanguage = (code: string): string => {
  // Simple language detection based on syntax patterns
  if (code.includes('class') && code.includes('public') && code.includes('{') && code.includes('}')) {
    if (code.includes('System.out.println')) return 'java';
    if (code.includes('Console.WriteLine')) return 'csharp';
  }

  if (code.includes('def ') && code.includes(':')) return 'python';
  if (code.includes('function') || code.includes('=>') || code.includes('const ')) return 'javascript';
  if (code.includes('interface') || code.includes('type ') || code.includes('export ')) return 'typescript';
  if (code.includes('<div') || code.includes('<span') || code.includes('</')) return 'markup';
  if (code.includes('{') && code.includes('}') && code.includes(':')) return 'css';

  // Default to typescript
  return 'typescript';
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(language || 'typescript');
  const cleanedCode = cleanCode(code);

  useEffect(() => {
    if (!language) {
      setDetectedLanguage(detectLanguage(cleanedCode));
    }

    Prism.highlightAll();
  }, [code, language, cleanedCode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cleanedCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Map language to display name
  const getLanguageDisplayName = (lang: string): string => {
    const langMap: Record<string, string> = {
      'typescript': 'TypeScript',
      'javascript': 'JavaScript',
      'python': 'Python',
      'java': 'Java',
      'csharp': 'C#',
      'markup': 'HTML',
      'css': 'CSS',
      'c': 'C',
      'cpp': 'C++'
    };

    return langMap[lang] || lang;
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-blue-50 dark:bg-gray-800/70 shadow-md transition-all duration-300 ${expanded ? 'fixed inset-4 z-50' : ''}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-blue-100/50 dark:bg-gray-700/50">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-xs font-medium flex items-center text-gray-600 dark:text-gray-300 ml-3">
            <FiCode className="mr-1.5" />
            {getLanguageDisplayName(detectedLanguage)}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleExpand}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-colors"
            title={expanded ? "Thu nhỏ" : "Phóng to"}
          >
            {expanded ? <FiMinimize size={16} /> : <FiMaximize size={16} />}
          </button>
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-colors"
            title="Sao chép code"
          >
            {copied ? <FiCheck size={16} className="text-green-500" /> : <FiCopy size={16} />}
          </button>
        </div>
      </div>

      <div className={`overflow-auto ${expanded ? 'max-h-[calc(100vh-120px)]' : 'max-h-[500px]'}`}>
        <pre className={`p-4 md:p-6 bg-blue-50/50 dark:bg-gray-800/50 text-base md:text-lg ${expanded ? 'min-h-[300px]' : ''}`}>
          <code className={`language-${detectedLanguage} coldark-cold dark:coldark-dark`}>
            {cleanedCode}
          </code>
        </pre>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={toggleExpand}
        ></div>
      )}
    </div>
  );
};

export default CodeBlock;
