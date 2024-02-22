import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          " outline-2 outline-mainPurple/30  hover:outline-[3px] focus-visible:outline-[3px] flex h-10 w-full rounded-md  bg-white px-3 py-2 text-sm ring-offset-white  file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 outline-none  focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
// focus-visible:ring-2 focus-visible:ring-mainPurple
