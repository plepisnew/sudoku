import { cn } from "@/utils/cn";
import React, { DetailedHTMLProps, SelectHTMLAttributes } from "react";

export type DropdownProps = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  options: { label: string; value: string }[];
};

export const Dropdown: React.FC<DropdownProps> = ({
  className,
  options,
  ...props
}) => {
  return (
    <select
      title="test"
      className={cn(
        "px-3 py-2 rounded-lg bg-zinc-200 w-full",
        "hover:bg-zinc-300 transition-colors",
        className
      )}
      {...props}
    >
      {options.map(({ label, value }) => (
        <option key={label} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
