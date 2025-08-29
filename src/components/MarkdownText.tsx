import React from "react";
import ReactMarkdown from "react-markdown";

type MarkdownTextProps = {
  children: string;
};

const MarkdownText: React.FC<MarkdownTextProps> = ({ children }) => {
  return (
    <div className="prose prose-blue max-w-none">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
};

export default MarkdownText;
