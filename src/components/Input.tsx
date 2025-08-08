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
      <label htmlFor={name} className="font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        {...register(name)}
        {...rest}
        className={`w-full p-2 border rounded-md ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <span className="text-red-500 text-sm">{error.message}</span>
      )}
    </div>
  );
};