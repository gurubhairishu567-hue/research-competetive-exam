import React from 'react';
import Markdown from 'react-markdown';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-sm md:text-base ${className}`}>
      <Markdown>{content}</Markdown>
    </div>
  );
};
