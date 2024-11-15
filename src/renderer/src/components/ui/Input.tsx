import { cn } from '@renderer/utils';
import React from 'react';
import { FieldError } from 'react-hook-form';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: FieldError; // Kiểu của lỗi từ react-hook-form
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ error, className, ...props }, ref) => {
    return (
        <input
            {...props}
            ref={ref}
            className={cn(
                "px-2 py-2 rounded-lg text-sm outline-none transition-colors duration-200",
                "dark:bg-zinc-700 bg-white border border-zinc-300",
                "focus:ring-2 focus:ring-offset-2",
                "dark:focus:ring-offset-zinc-800 focus:ring-offset-white focus:ring-zinc-800",
                "dark:focus:ring-zinc-500 dark:border-zinc-700",
                error ? "border-red-500 focus:ring-red-500" : "", // Đổi màu khi có lỗi
                className
            )}

        />
    );
})

export default Input;
