import { BoardSize, BoardType } from "@/api/Sudoku";
import { useDropdown } from "@/components/hooks/useDropdown";
import { useSudokuBoard } from "@/components/hooks/useSudokuBoard";
import { BoardMode, BoardStyle } from "@/components/sudoku/SudokuBoard";
import { Box } from "@/components/ui/Box";
import { cn } from "@/utils/cn";
import React from "react";
import { Instructions, Usage } from "./BoardHelpers";
import { Button } from "@/components/ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInput } from "@/components/hooks/useInput";
import toastLib from "react-hot-toast";
import { toast } from "@/components/ui/Toaster";

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

	const [NameInput, { value: name }] = useInput({
		label: "Board name",
		props: { placeholder: "My Cursed board" },
	});

	const [DescriptionInput, { value: description }] = useInput({
		props: {
			placeholder: "Short optional description of your masterpiece",
			isArea: true,
			className: "resize-none flex-grow",
		},
		optional: true,
		label: "Board description",
		wrapperClassName: "flex-grow",
	});

	const [Board, sudokuContext] = useSudokuBoard({
		boardMode: BoardMode.Enum.EDIT,
		boardType,
		boardSize,
		boardStyle,
		setBoardSize,
		setBoardType,
	});

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const boardId = searchParams.get("id");
	const board = sudokuContext.boards.find((_board) => _board.id === boardId);

	const StorageButtons = (
		<React.Fragment>
			<Button variant="secondary" className="flex-1" onClick={() => navigate("/")}>
				{board ? "Discard Changes" : "Drop Board"}
			</Button>
			<Button
				variant="primary"
				className="flex-1"
				onClick={() => {
					// toast("Testing natural behavior");
					// toast.custom(<div className="bg-red-500">Testing unnatural behavior</div>);
					// toastLib.success("testing");
					toast.error("Error");
					toast.information("Information");
					toast.loading("Loading");
					toast.success("Success");
					toast.warning("Warning");
					return;
					if (board) {
						const updateResponse = sudokuContext.updateBoard({ id: boardId!, name, description });

						// TODO notify about successful or error update
						return;
					}

					const exportResponse = sudokuContext.exportBoard({ name, description });

					if (exportResponse.ok) {
						navigate("/");
					}
				}}
			>
				{board ? "Save Board" : "Create Board"}
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
						<div className={cn("inputs-container", "flex flex-col gap-4 flex-grow")}>
							{NameInput}
							{DescriptionInput}
						</div>
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
