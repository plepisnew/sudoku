import { ChangeEvent, useState } from "react";
import { Input, InputProps } from "../ui/Input";
import { Setter } from "@/utils/types";
import { cn } from "@/utils/cn";

export type InputContext = {
	value: string;
	setValue: Setter<string>;
};

export const useInput = <TArea extends boolean>(useInputOptions?: {
	props?: InputProps<TArea>;
	wrapperClassName?: string;
	labelClassName?: string;
	label?: string;
	initialValue?: string;
	optional?: boolean;
}): [JSX.Element, InputContext] => {
	const {
		label,
		initialValue,
		optional = false,
		props,
		wrapperClassName,
		labelClassName,
	} = useInputOptions ?? {};

	const [value, setValue] = useState(initialValue ?? "");

	const InputNode = (
		<Input
			value={value}
			onChange={(e: ChangeEvent<HTMLTextAreaElement & HTMLInputElement>) => {
				setValue(e.currentTarget.value);
			}}
			{...props}
		/>
	);

	const CompoundInput = label ? (
		<div className={cn("input-container", "flex flex-col gap-2 w-full", wrapperClassName)}>
			<label className={cn("label-container", "text-sm font-medium", labelClassName)}>
				{label}{" "}
				{optional && (
					<span className={cn("label-optional-marker", "font-normal text-zinc-500 italic")}>
						(optional)
					</span>
				)}
			</label>
			{InputNode}
		</div>
	) : (
		InputNode
	);

	const inputContext: InputContext = {
		value,
		setValue,
	};

	return [CompoundInput, inputContext];
};
