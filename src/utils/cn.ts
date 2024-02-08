import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tw-merge";

export const cn = (...classValues: ClassValue[]) => twMerge(clsx(classValues));
