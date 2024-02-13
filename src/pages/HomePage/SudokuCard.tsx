import { Board, Mark, SudokuConstants } from "@/api/Sudoku";
import { BoardMode, SudokuBoard } from "@/components/sudoku/SudokuBoard";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import React, { MouseEventHandler, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { EditorPageConstants } from "../EditorPage/EditorPage";
import { SolverPageConstants } from "../SolverPage/SolverPage";
import { FaTrash } from "react-icons/fa";
import { useSudokuApi } from "@/components/providers/SudokuApi";

export const SudokuCard: React.FC<Board> = (board) => {
	const navigate = useNavigate();
	const hintsRef = useRef<Mark[]>(board.hints);
	const sudokuApi = useSudokuApi();

	const handleClickEdit: MouseEventHandler = () => {
		const editorUrl = new URL(location.origin);

		editorUrl.searchParams.set("id", board.id);

		navigate({
			pathname: EditorPageConstants.PATH,
			search: new URLSearchParams({ id: board.id }).toString(),
		});
	};

	const handleClickSolve: MouseEventHandler = () => {
		const solverUrl = new URL(location.origin);

		solverUrl.searchParams.set("id", board.id);

		navigate({
			pathname: SolverPageConstants.PATH,
			search: new URLSearchParams({ id: board.id }).toString(),
		});
	};

	const handleClickDelete: MouseEventHandler = () => {
		sudokuApi.deleteBoard(board.id);
	};

	const TitleContents = (
		<div className={cn("box-title-container", "flex items-center")}>
			<span className={cn("box-title", "flex-grow")}>{board.name}</span>
			<FaTrash className={cn("sudoku-deleter", "cursor-pointer")} onClick={handleClickDelete} />
		</div>
	);

	return (
		<Box Title={TitleContents}>
			<SudokuBoard
				mode={BoardMode.Enum.STATIC}
				size={board.size}
				type={board.type}
				cellSize={SudokuConstants.Cells.SIZE_STATIC}
				className="self-center w-full h-full"
				ref={{ hintsRef }}
			/>
			<div className={cn("sudoku-card-button-container", "flex gap-4 [&>*]:flex-grow")}>
				<Button className={cn("sudoku-card-button")} variant="secondary" onClick={handleClickEdit}>
					Edit
				</Button>
				<Button className={cn("sudoku-card-button")} variant="primary" onClick={handleClickSolve}>
					Solve
				</Button>
			</div>
		</Box>
	);
};
