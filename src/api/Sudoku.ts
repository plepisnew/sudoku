import { z } from "zod";
import { ApiResult } from ".";

export const BoardType = z.enum([
	"NORMAL",
	"JIGSAW",
	"DIAGONAL",
	"TENS_FIVES",
	"KILLER",
	"EVEN_ODD",
	"CONSECUTIVE",
	"WINDOKU",
]);

export type BoardType = z.infer<typeof BoardType>;

export const BoardSize = z.enum(["SMALL", "NORMAL"]);

export type BoardSize = z.infer<typeof BoardSize>;

export const smallBoardCellValueSchema = z.union([
	z.literal(1),
	z.literal(2),
	z.literal(3),
	z.literal(4),
	z.literal(5),
	z.literal(6),
]);

export const normalBoardCellValueSchema = z.union([
	z.literal(1),
	z.literal(2),
	z.literal(3),
	z.literal(4),
	z.literal(5),
	z.literal(6),
	z.literal(7),
	z.literal(8),
	z.literal(9),
]);

const cellIndexesSchema = z.object({
	blockIndex: z.number(),
	cellIndex: z.number(),
});

const markSchema = cellIndexesSchema.merge(
	z.object({
		value: z.number(),
	}),
);

const boardSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	type: BoardType,
	size: BoardSize,
	hints: z.array(markSchema),
});

const boardsSchema = z.array(boardSchema);

export type Board = z.infer<typeof boardSchema>;

export type Mark = z.infer<typeof markSchema>;

export type CellIndexes = z.infer<typeof cellIndexesSchema>;

export const SudokuConstants = {
	LOCAL_STORAGE_KEY: "boards",
	Cells: {
		SIZE: 72,
	},
	Blocks: {
		[BoardSize.Enum.SMALL]: {
			WIDTH: 3,
			HEIGHT: 2,
			COUNT_X: 2,
			COUNT_Y: 3,
		},
		[BoardSize.Enum.NORMAL]: {
			WIDTH: 3,
			HEIGHT: 3,
			COUNT_X: 3,
			COUNT_Y: 3,
		},
	},
} as const;

export class SudokuService {
	constructor() {
		// this.listBoards = this.listBoards.bind(this);
		// this.clearBoards = this.clearBoards.bind(this);
	}

	clearBoards(): ApiResult {
		localStorage.setItem(SudokuConstants.LOCAL_STORAGE_KEY, JSON.stringify([]));

		return { ok: true };
	}

	listBoards(): ApiResult<Board[], true> {
		const boards = localStorage.getItem(SudokuConstants.LOCAL_STORAGE_KEY);

		if (boards == null) {
			this.clearBoards();

			return { ok: true, payload: [] };
		}

		const result = boardsSchema.safeParse(boards);

		if (!result.success) {
			this.clearBoards();

			return { ok: true, payload: [] };
		}

		return { ok: true, payload: result.data };
	}

	addBoard(board: Omit<Board, "id">): ApiResult<{ boards: Board[]; newBoard: Board }> {
		const storableBoard: Board = { ...board, id: crypto.randomUUID() };

		const result = boardSchema.safeParse(storableBoard);

		if (!result.success) {
			return { ok: false, error: "Input board does not adhere to schema" };
		}

		const boards: Board[] = [result.data];

		const boardsResponse = this.listBoards();

		if (boardsResponse.ok) {
			boards.push(...boardsResponse.payload);
		} else {
			this.clearBoards();
		}

		localStorage.setItem(SudokuConstants.LOCAL_STORAGE_KEY, JSON.stringify(boards));

		return { ok: true, payload: { boards, newBoard: storableBoard } };
	}

	deleteBoard(id: Board["id"]): ApiResult<Board[]> {
		const boards = this.listBoards().payload;

		const filteredBoards = boards.filter((board) => board.id !== id);

		if (boards.length === filteredBoards.length) {
			return { ok: false, error: `Board "${id}" does not exist` };
		}

		localStorage.setItem(SudokuConstants.LOCAL_STORAGE_KEY, JSON.stringify(filteredBoards));

		return { ok: true, payload: filteredBoards };
	}

	getBoard(id: Board["id"]): ApiResult<Board> {
		const boards = this.listBoards().payload;

		const board = boards.find((_board) => _board.id === id);

		if (board === undefined) {
			return { ok: false, error: `Unable to find board "${id}"` };
		}

		return { ok: true, payload: board };
	}

	updateBoard(board: Board): ApiResult<{ boards: Board[]; updatedBoard: Board }> {
		const boardResponse = this.getBoard(board.id);

		if (!boardResponse.ok) {
			return boardResponse;
		}

		const boards = this.listBoards().payload.map((_board) =>
			_board.id === board.id ? board : _board,
		);

		localStorage.setItem(SudokuConstants.LOCAL_STORAGE_KEY, JSON.stringify(boards));

		return { ok: true, payload: { boards, updatedBoard: board } };
	}
}
