import { cn } from "@/utils/cn";
import { ComponentProps, ReactNode } from "react";

export type InputProps<TArea extends boolean> = { isArea?: TArea } & (TArea extends true
	? ComponentProps<"input">
	: ComponentProps<"textarea">);

export function Input<TArea extends boolean>({
	isArea,
	className,
	...props
}: Partial<InputProps<TArea>>): ReactNode {
	const commonClassName = cn(
		"px-3 py-2 rounded-lg bg-zinc-200 w-full",
		"hover:bg-zinc-300 transition-colors",
	);

	if (isArea) {
		return (
			<textarea
				className={cn("text-area", commonClassName, className)}
				{...(props as ComponentProps<"textarea">)}
			/>
		);
	}
	return (
		<input
			type="text"
			className={cn("text-input", commonClassName, className)}
			{...(props as ComponentProps<"input">)}
		/>
	);
}
