import { cn } from "@/utils/cn";
import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";

export const Input: React.FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = ({ className, ...props }) => {
  return <input type="text" className={cn("", className)} {...props} />;
};
