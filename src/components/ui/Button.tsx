import { cn } from "@/utils/cn";
import { HTMLProps } from "@/utils/types";
import React from "react";

export type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ButtonPropsUnique & HTMLProps<HTMLButtonElement>;

export type ButtonPropsUnique = {
	variant?: ButtonVariant;
};

const buttonDefaults: Required<ButtonPropsUnique> = {
	variant: "primary",
};

const variantClassNames: Record<ButtonVariant, string> = {
	primary: cn(
		"px-3 py-2 cursor-pointer",
		"bg-zinc-300/60 rounded-lg text-zinc-800",
		"hover:bg-zinc-300/80 active:bg-zinc-300 transition-colors",
	),
	secondary: cn(
		"px-3 py-2 cursor-pointer",
		"border-2 border-zinc-300 rounded-lg text-zinc-800",
		"hover:bg-zinc-300/20 active:bg-zinc-300/40 transition-colors",
	),
};

export const Button: React.FC<ButtonProps> = ({
	className,
	variant = buttonDefaults.variant,
	...props
}) => {
	return <button className={cn("button", variantClassNames[variant], className)} {...props} />;
};
