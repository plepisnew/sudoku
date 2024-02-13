import { BoardSize, BoardType, Mark } from "@/api/Sudoku";
import { useDropdown } from "@/components/hooks/useDropdown";
import { useSudokuBoard } from "@/components/hooks/useSudokuBoard";
import { BoardMode, BoardStyle } from "@/components/sudoku/SudokuBoard";
import { Box } from "@/components/ui/Box";
import { cn } from "@/utils/cn";
import React, { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInput } from "@/components/hooks/useInput";
import { toast } from "@/components/ui/Toaster";
import { api } from "@/api";
import { Instructions, Usage } from "@/components/sudoku/SudokuHelpers";
import { useOnce } from "@/components/hooks/useOnce";
import { BoardNotFound } from "@/components/sudoku/BoardNotFound";

export const EditorPageConstants = {
	PATH: "/editor",
};

export const EditorPage: React.FC = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const boardId = searchParams.get("id");
	const boards = api.Sudoku.listBoards().payload;
	const board = boards.find(({ id }) => id === boardId);

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
		{ label: "Board type", defaultValue: board?.type },
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
		{ label: "Board size", defaultValue: board?.size },
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
		initialValue: board?.name,
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
		initialValue: board?.description,
		wrapperClassName: "flex-grow",
	});

	const marksRef = useRef<Mark[]>([]);
	const hintsRef = useRef<Mark[]>(board?.hints ?? []);

	const [Board, sudokuContext] = useSudokuBoard({
		boardMode: BoardMode.Enum.EDIT,
		boardType,
		boardSize,
		boardStyle,
		setBoardSize,
		setBoardType,
		hintsRef,
		marksRef,
	});

	useOnce(() => {
		if (board) {
			sudokuContext.importBoard(boardId!);
		}
	});

	if (!boardId && board) {
		return <BoardNotFound boards={boards} />;
	}

	const StorageButtons = (
		<React.Fragment>
			<Button variant="secondary" onClick={() => navigate("/")}>
				{board ? "Discard Changes" : "Drop Board"}
			</Button>
			<Button
				variant="primary"
				onClick={() => {
					if (board) {
						const updateResponse = sudokuContext.updateBoard({ id: boardId!, name, description });

						if (updateResponse.ok) {
							toast.success(
								<span>
									Board <span className="font-semibold">"{board.name}"</span> successfully updated
								</span>,
							);
							return navigate("/");
						}

						return toast.error(updateResponse.error);
					}

					const exportResponse = sudokuContext.exportBoard({ name, description });

					if (exportResponse.ok) {
						toast.success(
							<span>
								Board{" "}
								<span className="font-semibold">"{exportResponse.payload.newBoard.name}"</span>{" "}
								successfully created
							</span>,
						);
						return navigate("/");
					}

					return toast.error(exportResponse.error);
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
					<Box className={cn("board-config", "flex flex-col p-0")} Title="Board configuration">
						{BoardTypeDropdown}
						{BoardSizeDropdown}
						{BoardStyleDropdown}
					</Box>
					<Box className={cn("details-config", "flex-grow")} Title="Board Details">
						<div className={cn("inputs-container", "flex flex-col gap-4 flex-grow")}>
							{NameInput}
							{DescriptionInput}
						</div>
						<div className={cn("button-container", "flex gap-4 [&>*]:flex-1")}>
							{StorageButtons}
						</div>
					</Box>
				</div>
				<Box className={cn("board-editor", "flex flex-col")} Title="Board editor">
					{Board}
				</Box>
				<div className={cn("dashboard-info-container", "flex flex-col gap-4 flex-1 self-stretch")}>
					<Box Title="Instructions" className={cn("instruction-container", "")}>
						{Instructions[boardType]}
					</Box>
					<Box Title="Usage" className={cn("usage-container", "flex-grow")}>
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
	<li>Prevent pencil marks and normal marks being written behind hints</li>
	<li>Add control options for manually inputting digits</li>
	<li>Add highlight options</li>
	<li>Add chess sudoku</li>
	<li>Fix styling</li>
</ol> */
}
