import { api } from "@/api";
import { Mark } from "@/api/Sudoku";
import { BoardNotFound } from "@/components/sudoku/BoardNotFound";
import { BoardMode, SudokuBoard } from "@/components/sudoku/SudokuBoard";
import { Instructions, SizeDisplay, TypeDisplay } from "@/components/sudoku/SudokuHelpers";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import React, { MouseEventHandler, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export const SolverPageConstants = {
	PATH: "/solver",
};

export const SolverPage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const boardId = searchParams.get("id");
	const boards = api.Sudoku.listBoards().payload;
	const board = boards.find(({ id }) => id === boardId);

	const hintsRef = useRef<Mark[]>(board?.hints ?? []);
	const marksRef = useRef<Mark[]>([]);

	if (!board) {
		return <BoardNotFound boards={boards} />;
	}

	const handleCheckBoard: MouseEventHandler = () => {
		console.log(marksRef.current);
		console.log(hintsRef.current);
	};

	const boardInformation = [
		["Name", board.name],
		["Description", board.description],
		["Type", TypeDisplay[board.type]],
		["Size", SizeDisplay[board.size]],
	].filter(([, value]) => value !== undefined) as [string, string | undefined][];

	return (
		<div className={cn("page-container", "flex gap-8 justify-center")}>
			<Box Title="Board (duh)">
				<SudokuBoard
					mode={BoardMode.Enum.SOLVE}
					type={board.type}
					size={board.size}
					ref={{ hintsRef, marksRef }}
				/>
			</Box>
			<div className={cn("content-container", "flex flex-col gap-8 w-[500px]")}>
				<Box Title="Information about board" contentClassName="gap-2">
					{boardInformation.map(([key, value]) => (
						<span key={key}>
							<span className="font-medium">{key}:</span> {value}
						</span>
					))}
				</Box>
				<Box Title="How to solve?">{Instructions[board.type]}</Box>
				<Box Title="Cheats & stuff">
					<div className="flex gap-4 [&>*]:flex-grow">
						<Button variant="secondary" onClick={handleCheckBoard}>
							Reset board
						</Button>
						<Button variant="primary" onClick={handleCheckBoard}>
							Check board
						</Button>
					</div>
				</Box>
			</div>
		</div>
	);
};
