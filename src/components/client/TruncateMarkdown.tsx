'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const TruncateMarkdown = ({ content, limit }: { content: string; limit: number }) => {
    const truncatedContent =
        content.length > limit ? `${content.substring(0, limit)}...` : content;

    return (
        <div className="prose prose-slate max-w-none text-[1.4rem] leading-relaxed">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Customize typography elements to match our design
                    p: ({ node, ...props }) => <p className="text-slate-600" {...props} />,
                    a: ({ node, ...props }) => <a className="text-indigo-600 hover:text-indigo-800 no-underline" {...props} />,
                    ul: ({ node, ...props }) => <ul className="text-slate-600" {...props} />,
                    ol: ({ node, ...props }) => <ol className="text-slate-600" {...props} />,
                    code: ({ node, ...props }) => <code className="text-slate-800 bg-indigo-50 px-1 py-0.5 rounded" {...props} />
                }}
            >
                {truncatedContent}
            </ReactMarkdown>
        </div>
    );
};

export default TruncateMarkdown;
