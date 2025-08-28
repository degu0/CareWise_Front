import React from "react";

interface ToastProps {
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div
      className={`fixed bottom-5 right-10 px-10 py-5 rounded shadow-lg text-white transition-all duration-300 z-50 bg-zinc-800`}
    >
      {message}
    </div>
  );
};
