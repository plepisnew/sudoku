import { Dispatch, SetStateAction } from "react";

export type Setter<T> = Dispatch<SetStateAction<T>>;

export type ArrayMap<TSource, TDestination> = (
	value: TSource,
	index: number,
	arr: TSource[],
) => TDestination;

export type ArrayFilter<TSource> = ArrayMap<TSource, boolean>;

export type ArrayForEach<TSource> = ArrayMap<TSource, void>;
