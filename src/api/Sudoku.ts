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

export const BoardSize = z.enum(["SMALL", "NORMAL"]);

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

const boardSchema = z.object({
  id: z.string(),
  type: BoardType,
  size: BoardSize,
  hints: z.array(z.tuple([z.number(), normalBoardCellValueSchema])),
});

const boardsSchema = z.array(boardSchema);

export type Board = z.infer<typeof boardSchema>;

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

  addBoard(board: Omit<Board, "id">): ApiResult<Board[]> {
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

    localStorage.setItem(
      SudokuConstants.LOCAL_STORAGE_KEY,
      JSON.stringify(boards)
    );

    return { ok: true, payload: boards };
  }

  deleteBoard(id: Board["id"]): ApiResult<Board[]> {
    const boards = this.listBoards().payload;

    const filteredBoards = boards.filter((board) => board.id !== id);

    if (boards.length === filteredBoards.length) {
      return { ok: false, error: `Board "${id}" does not exist` };
    }

    localStorage.setItem(
      SudokuConstants.LOCAL_STORAGE_KEY,
      JSON.stringify(filteredBoards)
    );

    return { ok: true, payload: filteredBoards };
  }
}
