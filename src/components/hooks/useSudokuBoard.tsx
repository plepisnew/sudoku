import { ReactNode, useEffect, useState } from "react";
import { BoardMode, BoardStyle, SudokuBoard, SudokuBoardProps } from "../sudoku/SudokuBoard";
import { Board, BoardSize, BoardType, SudokuService } from "@/api/Sudoku";
import { z } from "zod";
import { ApiResult, api } from "@/api";
import { Setter } from "@/utils/types";

export type SudokuBoardContext = {
	importBoard: (id: Board["id"]) => ApiResult<{ board: Board }>;
	exportBoard: (
		options: Pick<Board, "name" | "description">,
	) => ReturnType<SudokuService["addBoard"]>;
	updateBoard: (
		options: Pick<Board, "id" | "name" | "description">,
	) => ReturnType<SudokuService["updateBoard"]>;
	boards: Board[];
};

export type UseSudokuBoardOptions = {
	boardType?: SudokuBoardProps["type"];
	boardSize?: SudokuBoardProps["size"];
	boardMode?: SudokuBoardProps["mode"];
	boardStyle?: z.infer<typeof BoardStyle>;
	setBoardType: Setter<NonNullable<SudokuBoardProps["type"]>>;
	setBoardSize: Setter<NonNullable<SudokuBoardProps["size"]>>;
};

export type SudokuBoard = {
	name: string;
	description?: string;
	boardType: NonNullable<SudokuBoardProps>["type"];
	boardSize: NonNullable<SudokuBoardProps>["size"];
	hints: NonNullable<SudokuBoardProps>["hints"];
};

export const useSudokuBoard = ({
	boardType = BoardType.Enum.NORMAL,
	boardSize = BoardSize.Enum.NORMAL,
	boardMode = BoardMode.Enum.STATIC,
	boardStyle = BoardStyle.Enum.NORMAL,
	setBoardType,
	setBoardSize,
}: UseSudokuBoardOptions): [ReactNode, SudokuBoardContext] => {
	const [boards, setBoards] = useState<Board[]>([]);
	const [boardHints, setBoardHints] = useState<Board["hints"]>([]);

	useEffect(() => {
		setBoards(api.Sudoku.listBoards().payload);
	}, []);

	const exportBoard: SudokuBoardContext["exportBoard"] = (options) => {
		if (!options.name) {
			return { ok: false, error: "Please supply a name for the board" };
		}

		const addBoardResponse = api.Sudoku.addBoard({
			size: boardSize,
			type: boardType,
			name: options.name,
			description: options.description ?? "",
			hints: [],
		});

		if (addBoardResponse.ok) {
			setBoards(addBoardResponse.payload.boards);
		}

		return addBoardResponse;
	};

	const importBoard: SudokuBoardContext["importBoard"] = (id) => {
		const boards = api.Sudoku.listBoards().payload;

		const board = boards.find((board) => board.id === id);

		if (board === undefined) {
			return { ok: false, error: `Unable to find board "${id}"` };
		}

		setBoardType(board.type);
		setBoardSize(board.size);
		setBoardHints(board.hints);

		return {
			ok: true,
			payload: { board },
		};
	};

	const updateBoard: SudokuBoardContext["updateBoard"] = (board) => {
		if (!board.name) {
			return { ok: false, error: "Please supply a name for the board" };
		}

		const updateResponse = api.Sudoku.updateBoard({
			...board,
			type: boardType,
			size: boardSize,
			hints: boardHints,
		});

		if (updateResponse.ok) {
			setBoards(updateResponse.payload.boards);
		}

		return updateResponse;
	};

	const sudokuBoardContext: SudokuBoardContext = {
		exportBoard,
		importBoard,
		updateBoard,
		boards,
	};

	const BoardNode = (
		<SudokuBoard
			size={boardSize}
			type={boardType}
			mode={boardMode}
			style={boardStyle}
			hints={boardHints}
			setHints={setBoardHints}
		/>
	);

	return [BoardNode, sudokuBoardContext];
};
