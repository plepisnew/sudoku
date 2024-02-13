import { cn } from "@/utils/cn";
import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

export type BoxProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
	Title?: ReactNode;
	contentClassName?: string;
};

export const Box: React.FC<BoxProps> = ({
	className,
	children,
	Title,
	contentClassName,
	...props
}) => (
	<div
		className={cn(
			"box",
			"flex flex-col bg-zinc-100 border border-zinc-300 rounded-lg shadow-md shadow-black/10",
			className,
		)}
		{...props}
	>
		{Title && (
			<span
				className={cn(
					"box-title",
					"px-4 py-2 select-none",
					"bg-zinc-200/90 border-b border-b-zinc-300",
				)}
			>
				{Title}
			</span>
		)}
		<div className={cn("box-content", "p-4 flex flex-col gap-4 flex-grow", contentClassName)}>
			{children}
		</div>
	</div>
);
