import React, { ReactNode } from "react";
import { BoardMode, BoardStyle, SudokuBoard, SudokuBoardProps } from "../sudoku/SudokuBoard";
import { Board, BoardSize, BoardType, SudokuService } from "@/api/Sudoku";
import { z } from "zod";
import { useBoardsApi } from "@/utils/hooks";
import { ApiResult } from "@/api";
import { Setter } from "@/utils/types";

export type BoardContext = {
	importBoard: (id: Board["id"]) => ApiResult<{ board: Board }>;
	exportBoard: (
		options: Pick<Board, "name" | "description">,
	) => ReturnType<SudokuService["addBoard"]>;
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
}: UseSudokuBoardOptions): [ReactNode, BoardContext] => {
	const boardsApi = useBoardsApi();

	const exportBoard: BoardContext["exportBoard"] = (options) => {
		const addBoardResponse = boardsApi.addBoard({
			size: boardSize,
			type: boardType,
			name: options.name,
			description: options.description,
			hints: [],
		});

		return addBoardResponse;
	};

	const importBoard: BoardContext["importBoard"] = (id) => {
		const boards = boardsApi.listBoards().payload;

		const board = boards.find((board) => board.id === id);

		if (board === undefined) {
			return { ok: false, error: `Unable to find board "${id}"` };
		}

		setBoardType(board.type);
		setBoardSize(board.size);

		return {
			ok: true,
			payload: { board },
		};
	};

	const boardContext: BoardContext = {
		exportBoard,
		importBoard,
	};

	const BoardNode = (
		<SudokuBoard size={boardSize} type={boardType} mode={boardMode} style={boardStyle} />
	);

	return [BoardNode, boardContext];
};
