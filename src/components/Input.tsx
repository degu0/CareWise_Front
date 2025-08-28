import type { UseFormRegister, FieldError } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
}

export const Input = ({
  label,
  name,
  register,
  error,
  required,
  ...rest
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name} className="font-medium text-gray-800">
        {label}{" "}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        {...register(name)}
        {...rest}
        className={`w-full px-3 py-2 border rounded-md text-sm outline-none transition-colors 
          ${error ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1">
          {error.message}
        </span>
      )}
    </div>
  );
};
