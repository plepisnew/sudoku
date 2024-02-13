import { Board, Mark, SudokuConstants } from "@/api/Sudoku";
import { BoardMode, SudokuBoard } from "@/components/sudoku/SudokuBoard";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import React, { MouseEventHandler, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { EditorPageConstants } from "../EditorPage/EditorPage";
import { SolverPageConstants } from "../SolverPage/SolverPage";

export const SudokuCard: React.FC<Board> = (board) => {
	const navigate = useNavigate();
	const hintsRef = useRef<Mark[]>(board.hints);

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

	return (
		<Box title={board.name}>
			<SudokuBoard
				mode={BoardMode.Enum.STATIC}
				size={board.size}
				type={board.type}
				cellSize={SudokuConstants.Cells.SIZE_STATIC}
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
