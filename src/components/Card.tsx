import React from "react";

interface CardProps {
  width?: string;
  height?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Card = ({
  width = "w-48",
  height = "h-64",
  className = "",
  children,
}: CardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${width} ${height} ${className}`}
    >
      {children || (
        <div className="h-full flex items-center justify-center text-zinc-400">
          Card content
        </div>
      )}
    </div>
  );
};
