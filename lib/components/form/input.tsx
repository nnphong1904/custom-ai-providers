import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-500 px-3 py-2",
        "text-sm ring-offset-background",
        "bg-white dark:bg-gray-900",
        "text-gray-900 dark:text-[#ECECEC]",
        "placeholder:text-gray-500 dark:placeholder:text-gray-400",
        "focus-visible:outline-none focus-visible:border-blue-500 focus-visible:border-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
