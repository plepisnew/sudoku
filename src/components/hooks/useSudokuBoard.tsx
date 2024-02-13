import { ReactNode } from "react";
import {
	BoardMode,
	BoardStyle,
	SudokuBoard,
	SudokuBoardProps,
	SudokuBoardPropsRefs,
} from "../sudoku/SudokuBoard";
import { Board, BoardSize, BoardType, SudokuService } from "@/api/Sudoku";
import { z } from "zod";
import { ApiResult } from "@/api";
import { Setter } from "@/utils/types";
import { useSudokuApi } from "../providers/SudokuApi";

export type SudokuBoardContext = {
	importBoard: (id: Board["id"]) => ApiResult<{ board: Board }>;
	exportBoard: ({
		...options
	}: Pick<Board, "name" | "description">) => ReturnType<SudokuService["addBoard"]>;
	updateBoard: (
		options: Pick<Board, "id" | "name" | "description">,
	) => ReturnType<SudokuService["updateBoard"]>;
};

export type UseSudokuBoardOptions = {
	boardType?: SudokuBoardProps["type"];
	boardSize?: SudokuBoardProps["size"];
	boardMode?: SudokuBoardProps["mode"];
	boardStyle?: z.infer<typeof BoardStyle>;
	setBoardType: Setter<NonNullable<SudokuBoardProps["type"]>>;
	setBoardSize: Setter<NonNullable<SudokuBoardProps["size"]>>;
} & SudokuBoardPropsRefs;

export type SudokuBoard = {
	name: string;
	description?: string;
	boardType: NonNullable<SudokuBoardProps>["type"];
	boardSize: NonNullable<SudokuBoardProps>["size"];
};

export const useSudokuBoard = ({
	boardType = BoardType.Enum.NORMAL,
	boardSize = BoardSize.Enum.NORMAL,
	boardMode = BoardMode.Enum.STATIC,
	boardStyle = BoardStyle.Enum.NORMAL,
	setBoardType,
	setBoardSize,
	hintsRef,
	marksRef,
}: UseSudokuBoardOptions): [ReactNode, SudokuBoardContext] => {
	const sudokuApi = useSudokuApi();

	const exportBoard: SudokuBoardContext["exportBoard"] = (options) => {
		return sudokuApi.addBoard({
			...options,
			type: boardType,
			size: boardSize,
			hints: hintsRef.current,
		});
	};

	const importBoard: SudokuBoardContext["importBoard"] = (id) => {
		const board = sudokuApi.boards.find((board) => board.id === id);

		if (board === undefined) {
			return { ok: false, error: `Unable to find board "${id}"` };
		}

		setBoardType(board.type);
		setBoardSize(board.size);
		hintsRef.current = board.hints;

		return {
			ok: true,
			payload: { board },
		};
	};

	const updateBoard: SudokuBoardContext["updateBoard"] = (board) => {
		return sudokuApi.updateBoard({
			...board,
			type: boardType,
			size: boardSize,
			hints: hintsRef.current,
		});
	};

	const sudokuBoardContext: SudokuBoardContext = {
		exportBoard,
		importBoard,
		updateBoard,
	};

	const BoardNode = (
		<SudokuBoard
			size={boardSize}
			type={boardType}
			mode={boardMode}
			style={boardStyle}
			ref={{ marksRef, hintsRef }}
		/>
	);

	return [BoardNode, sudokuBoardContext];
};
