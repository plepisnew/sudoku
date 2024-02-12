import { cn } from "@/utils/cn";
import React, { MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import {
	ToastOptions as Lib_ToastOptions,
	Toast as Lib_Toast,
	toast as lib_toast,
} from "react-hot-toast";
import { IoIosCloseCircle } from "react-icons/io";

export type ToastProps = {
	type?: "success" | "error" | "warning" | "loading" | "information";
	dismissable?: boolean;
	className?: string;
	toast: Lib_Toast;
};

export const Toast: React.FC<ToastProps & PropsWithChildren> = ({
	type = "information",
	className,
	children,
	toast,
}) => {
	const classNames: Record<NonNullable<ToastProps["type"]>, string> = {
		information: "bg-cyan-500 text-white/70",
		error: "bg-red-500 text-white/70",
		loading: "bg-zinc-600 text-white/70",
		success: "bg-green-500 text-white/70",
		warning: "bg-yellow-500 text-white/70",
	};

	const handleDismissIcon: MouseEventHandler = () => {
		lib_toast.dismiss(toast.id);
	};

	return (
		<div
			className={cn(
				"toast",
				"flex items-center w-full",
				"shadow-md shadow-black/10 rounded-lg",
				"overflow-hidden",
				className,
			)}
			style={{
				animation:
					"0.35s cubic-bezier(0.21, 1.02, 0.73, 1) 0s 1 normal forwards running go2645569136",
			}}
		>
			<div className={cn("toast-content py-3 px-4 flex-grow", "rounded-l-lg bg-zinc-100")}>
				{children}
			</div>
			<div className={cn("toast-separator", "w-[1px] h-full bg-zinc-300")} />
			<div
				className={cn(
					"toast-icon-container",
					"flex items-center justify-center h-full p-2",
					"bg-zinc-200 cursor-pointer rounded-r-lg",
					classNames[type],
				)}
				onClick={handleDismissIcon}
			>
				<IoIosCloseCircle size={28} className={cn("toast-icon")} />
			</div>
		</div>
	);
};

type ToastOptions = Lib_ToastOptions & { dismissable?: boolean };

export const toast = {
	success: (children: ReactNode, options?: ToastOptions) =>
		lib_toast(
			(t) => (
				<Toast toast={t} type="success" dismissable={options?.dismissable}>
					{children}
				</Toast>
			),
			options,
		),
	loading: (children: ReactNode, options?: ToastOptions) =>
		lib_toast(
			(t) => (
				<Toast toast={t} type="loading" dismissable={options?.dismissable}>
					{children}
				</Toast>
			),
			options,
		),
	error: (children: ReactNode, options?: ToastOptions) =>
		lib_toast(
			(t) => (
				<Toast toast={t} type="error" dismissable={options?.dismissable}>
					{children}
				</Toast>
			),
			options,
		),
	warning: (children: ReactNode, options?: ToastOptions) =>
		lib_toast(
			(t) => (
				<Toast toast={t} type="warning" dismissable={options?.dismissable}>
					{children}
				</Toast>
			),
			options,
		),
	information: (children: ReactNode, options?: ToastOptions) =>
		lib_toast(
			(t) => (
				<Toast toast={t} type="information" dismissable={options?.dismissable}>
					{children}
				</Toast>
			),
			options,
		),
};
