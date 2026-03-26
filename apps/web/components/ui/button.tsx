import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost";
};

export function getButtonClasses(
  variant: ButtonProps["variant"] = "default",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-[13px] font-medium leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variant === "default" &&
      "bg-teal-700 text-white shadow-lg shadow-teal-900/15 hover:bg-teal-800",
    variant === "secondary" &&
      "bg-slate-100 text-slate-900 hover:bg-slate-200",
    variant === "ghost" && "text-slate-700 hover:bg-slate-100",
    className,
  );
}

export function Button({
  className,
  type = "button",
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonClasses(variant, className)}
      type={type}
      {...props}
    />
  );
}
