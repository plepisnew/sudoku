import { Board } from "@/api/Sudoku";
import { SolverPageConstants } from "@/pages/SolverPage/SolverPage";
import { cn } from "@/utils/cn";
import React, { MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";

export type BoardNotFoundProps = {
	boards?: Board[];
};

export const BoardNotFound: React.FC<BoardNotFoundProps> = ({ boards = [] }) => {
	const navigate = useNavigate();

	const getBoardClickHandler =
		(id: Board["id"]): MouseEventHandler =>
		() => {
			navigate({
				pathname: SolverPageConstants.PATH,
				search: new URLSearchParams({ id: id }).toString(),
			});
		};

	return (
		<div className={cn("page-container", "flex flex-col gap-4")}>
			<h1 className={cn("page-title", "text-3xl font-medium")}>Board not found</h1>
			<h2 className={cn("page-subtitle", "text-lg")}>
				The board you're looking for could not be found ;-; The only available boards are:
			</h2>
			<div>
				{boards.map((board, index) => (
					<div
						key={board.id}
						className={cn("available-board-container", "cursor-pointer")}
						onClick={getBoardClickHandler(board.id)}
					>
						{index + 1}. {board.name} <span className="font-medium">({board.id})</span>
					</div>
				))}
			</div>
		</div>
	);
};
