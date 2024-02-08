import { z } from "zod";

const BoardType = z.enum([
  "NORMAL",
  "JIGSAW",
  "DIAGONAL",
  "TENS_FIVES",
  "KILLER",
  "EVEN_ODD",
  "CONSECUTIVE",
  "WINDOKU",
]);

const BoardSize = z.enum(["SMALL", "NORMAL"]);

const boardSchema = z.object({
  id: z.string(),
  type: BoardType,
  size: BoardSize,
  hints: z.array(z.tuple([z.number(), z.number()])),
});

const boardsSchema = z.array(boardSchema);

export type Board = z.infer<typeof boardSchema>;

const SudokuConstants = {
  LOCAL_STORAGE_KEY: "boards",
};

export class SudokuService {
  constructor() {
    this.listBoards = this.listBoards.bind(this);
    this.clearBoards = this.clearBoards.bind(this);
  }

  clearBoards(): void {
    localStorage.setItem(SudokuConstants.LOCAL_STORAGE_KEY, JSON.stringify([]));
  }

  listBoards(): Board[] {
    const boards = localStorage.getItem(SudokuConstants.LOCAL_STORAGE_KEY);

    if (boards == null) {
      this.clearBoards();

      return [];
    }

    const result = boardsSchema.safeParse(boards);

    if (!result.success) {
      this.clearBoards();

      return [];
    }

    return result.data;
  }

  addBoard(board: Omit<Board, "id">): boolean {
    const storableBoard: Board = { ...board, id: crypto.randomUUID() };

    const result = boardSchema.safeParse(storableBoard);

    if (!result.success) {
      return false;
    }

    const boards = [...this.listBoards(), result.data];

    localStorage.setItem(
      SudokuConstants.LOCAL_STORAGE_KEY,
      JSON.stringify(boards)
    );

    return true;
  }

  deleteBoard(id: Board["id"]): boolean {
    const boards = this.listBoards();

    const filteredBoards = boards.filter((board) => board.id !== id);

    if (boards.length === filteredBoards.length) {
      return false;
    }

    localStorage.setItem(
      SudokuConstants.LOCAL_STORAGE_KEY,
      JSON.stringify(boards)
    );

    return true;
  }
}
