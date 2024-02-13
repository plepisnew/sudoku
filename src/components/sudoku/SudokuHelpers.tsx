import { BoardSize, BoardType } from "@/api/Sudoku";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";

export const Instructions: Record<BoardType, ReactNode> = {
	[BoardType.Enum.NORMAL]: (
		<div className={cn("instruction-container", "flex flex-col")}>
			<p>
				In a <b>Normal Sudoku</b>, all cells must satisfy the following constraints:
			</p>
			<ul className={cn("instruction-list", "list-disc list-inside")}>
				<li>
					Each digit must appear <i>once and exactly once</i> in each row;
				</li>
				<li>
					Each digit must appear <i>once and exactly once</i> in each column;
				</li>
				<li>
					Each digit must appear <i>once and exactly once</i> in each block.
				</li>
			</ul>
		</div>
	),
	[BoardType.Enum.JIGSAW]: <div></div>,
	[BoardType.Enum.DIAGONAL]: <div></div>,
	[BoardType.Enum.TENS_FIVES]: <div></div>,
	[BoardType.Enum.KILLER]: <div></div>,
	[BoardType.Enum.EVEN_ODD]: <div></div>,
	[BoardType.Enum.CONSECUTIVE]: <div></div>,
	[BoardType.Enum.WINDOKU]: <div></div>,
};

export const Usage: Record<BoardType, ReactNode> = {
	[BoardType.Enum.NORMAL]: (
		<div className={cn("usage-container", "flex flex-col gap-4")}>usage</div>
	),
	[BoardType.Enum.JIGSAW]: <div></div>,
	[BoardType.Enum.DIAGONAL]: <div></div>,
	[BoardType.Enum.TENS_FIVES]: <div></div>,
	[BoardType.Enum.KILLER]: <div></div>,
	[BoardType.Enum.EVEN_ODD]: <div></div>,
	[BoardType.Enum.CONSECUTIVE]: <div></div>,
	[BoardType.Enum.WINDOKU]: <div></div>,
};

export const TypeDisplay: Record<BoardType, string> = {
	[BoardType.Enum.NORMAL]: "Normal",
	[BoardType.Enum.JIGSAW]: "Jigsaw",
	[BoardType.Enum.DIAGONAL]: "Diagonal",
	[BoardType.Enum.TENS_FIVES]: "Tens & Fives",
	[BoardType.Enum.KILLER]: "Killer",
	[BoardType.Enum.EVEN_ODD]: "Even & Odd",
	[BoardType.Enum.CONSECUTIVE]: "Consecutive",
	[BoardType.Enum.WINDOKU]: "Windoku",
};

export const SizeDisplay: Record<BoardSize, string> = {
	[BoardSize.Enum.SMALL]: "Small (6x6)",
	[BoardSize.Enum.NORMAL]: "Normal (9x9)",
};
