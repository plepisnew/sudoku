import { BoardSize, BoardType } from "@/api/Sudoku";
import { useDropdown } from "@/components/hooks/useDropdown";
import { useSudokuBoard } from "@/components/hooks/useSudokuBoard";
import { BoardMode, BoardStyle } from "@/components/sudoku/SudokuBoard";
import { Box } from "@/components/ui/Box";
import { cn } from "@/utils/cn";
import React from "react";
import { Instructions, Usage } from "./BoardHelpers";
import { Button } from "@/components/ui/Button";
import { useParams, useSearchParams } from "react-router-dom";

export const EditorPage: React.FC = () => {
	const [BoardTypeDropdown, { value: boardType, setValue: setBoardType }] = useDropdown(
		[
			{
				value: BoardType.Enum.NORMAL,
				label: "Normal",
			},
			{
				value: BoardType.Enum.JIGSAW,
				label: "Jigsaw",
			},
			{
				value: BoardType.Enum.DIAGONAL,
				label: "Diagonal",
			},
			{
				value: BoardType.Enum.EVEN_ODD,
				label: "Even & Odd",
			},
			{
				value: BoardType.Enum.TENS_FIVES,
				label: "Tens & Fives",
			},
			{
				value: BoardType.Enum.KILLER,
				label: "Killer",
			},
			{
				value: BoardType.Enum.CONSECUTIVE,
				label: "Consecutive",
			},
			{
				value: BoardType.Enum.WINDOKU,
				label: "Windoku",
			},
		],
		{ label: "Board type" },
	);

	const [BoardSizeDropdown, { value: boardSize, setValue: setBoardSize }] = useDropdown(
		[
			{
				value: BoardSize.Enum.NORMAL,
				label: "Normal (9x9)",
			},
			{
				value: BoardSize.Enum.SMALL,
				label: "Small (6x6)",
			},
		],
		{ label: "Board size" },
	);

	const [BoardStyleDropdown, { value: boardStyle }] = useDropdown(
		[
			{
				value: BoardStyle.Enum.NORMAL,
				label: "Normal",
			},
			{
				value: BoardStyle.Enum.INFORMAL,
				label: "Informal",
			},
			{
				value: BoardStyle.Enum.MINIMAL,
				label: "Minimal",
			},
		],
		{ label: "Board style" },
	);

	const [Board, sudokuContext] = useSudokuBoard({
		boardMode: BoardMode.Enum.EDIT,
		boardType,
		boardSize,
		boardStyle,
		setBoardSize,
		setBoardType,
	});

	const [params] = useSearchParams();

	console.log(params.get("id"));

	const StorageButtons = (
		<React.Fragment>
			<Button variant="secondary" className="flex-1">
				Discard Board
			</Button>
			<Button variant="primary" className="flex-1">
				Save
			</Button>
		</React.Fragment>
	);

	return (
		<div className={cn("page-container", "flex flex-col gap-4")}>
			<h1 className={cn("page-title", "text-3xl")}>Sudoku Editor Dashboard</h1>
			<div className={cn("content-container", "flex gap-4 items-start")}>
				<div className={cn("config-container", "flex flex-col gap-4 flex-1 self-stretch")}>
					<Box className={cn("board-config", "flex flex-col p-0")} title="Board configuration">
						{BoardTypeDropdown}
						{BoardSizeDropdown}
						{BoardStyleDropdown}
					</Box>
					<Box className={cn("details-config", "flex-grow")} title="Board Details">
						<p className="mb-auto">details</p>
						<div className={cn("button-container", "flex gap-4")}>{StorageButtons}</div>
					</Box>
				</div>
				<Box className={cn("board-editor", "flex flex-col")} title="Board editor">
					{Board}
				</Box>
				<div className={cn("dashboard-info-container", "flex flex-col gap-4 flex-1 self-stretch")}>
					<Box title="Instructions" className={cn("instruction-container", "")}>
						{Instructions[boardType]}
					</Box>
					<Box title="Usage" className={cn("usage-container", "flex-grow")}>
						{Usage[boardType]}
					</Box>
				</div>
			</div>
		</div>
	);
};

{
	/* <ol>
	<li>Clean up code</li>
	<li>Disable pencil mark writing when mark left</li>
	<li>Disable mark writing when hint left</li>
	<li>Add support for other Sudoku modes</li>
	<li>Add support configuring sudoku defaults or managing config</li>
	<li>Add support for other board styles</li>
	<li>Support erasing with backspace or toggling the key</li>
	<li>
		Optimize code by using functional programming and using as few setters as possible and
		avoiding duplicated method calls
	</li>
</ol> */
}
