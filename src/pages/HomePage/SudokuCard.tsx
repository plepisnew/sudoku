import { Board, SudokuConstants } from "@/api/Sudoku";
import { BoardMode, SudokuBoard } from "@/components/sudoku/SudokuBoard";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import React, { MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { EditorPageConstants } from "../EditorPage/EditorPage";

export const SudokuCard: React.FC<Board> = (board) => {
	const navigate = useNavigate();

	const handleClickEdit: MouseEventHandler = () => {
		const editorUrl = new URL(location.origin);

		editorUrl.searchParams.set("id", board.id);

		navigate({
			pathname: EditorPageConstants.PATH,
			search: new URLSearchParams({ id: board.id }).toString(),
		});
	};

	const handleClickSolve: MouseEventHandler = () => {};

	return (
		<Box title={board.name}>
			<SudokuBoard
				mode={BoardMode.Enum.STATIC}
				hints={board.hints}
				cellSize={SudokuConstants.Cells.SIZE_STATIC}
			/>
			<div className={cn("sudoku-card-button-container", "flex gap-4")}>
				<Button
					className={cn("sudoku-card-button", "flex-grow")}
					variant="secondary"
					onClick={handleClickEdit}
				>
					Edit
				</Button>
				<Button
					className={cn("sudoku-card-button", "flex-grow")}
					variant="primary"
					onClick={handleClickSolve}
				>
					Solve
				</Button>
			</div>
		</Box>
	);
};
