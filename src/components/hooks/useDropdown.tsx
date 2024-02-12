import { useState, ChangeEventHandler } from "react";
import { Dropdown, DropdownProps } from "../ui/Dropdown";
import { cn } from "@/utils/cn";
import { Setter } from "@/utils/types";

export type UseDropdownContext<TValues extends string> = {
	value: TValues;
	setValue: Setter<TValues>;
};

export const useDropdown = <TValues extends string>(
	options: { label: string; value: TValues }[],
	useDropdownOptions?: {
		props?: Partial<DropdownProps>;
		title?: string;
		label?: string;
		defaultValue?: TValues;
	},
): [JSX.Element, UseDropdownContext<TValues>] => {
	const props = useDropdownOptions?.props;

	const [value, setValue] = useState<TValues>(useDropdownOptions?.defaultValue ?? options[0].value);

	const handleChangeValue: ChangeEventHandler<HTMLSelectElement> = (e) => {
		setValue(e.currentTarget.value as TValues);
	};

	const DropdownNode = (
		<Dropdown
			value={value}
			onChange={handleChangeValue}
			options={options}
			title={useDropdownOptions?.title}
			{...props}
		/>
	);

	const CompoundDropdown = useDropdownOptions?.label ? (
		<div className={cn("flex flex-col gap-2 w-full")}>
			<label className={cn("text-sm font-medium")}>{useDropdownOptions.label}</label>
			{DropdownNode}
		</div>
	) : (
		DropdownNode
	);

	const useDropdownContext: UseDropdownContext<TValues> = {
		value,
		setValue,
	};

	return [CompoundDropdown, useDropdownContext];
};
