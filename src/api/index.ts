import { SudokuService } from "./Sudoku";

export type ApiResult<T = never> =
  | (T extends never ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

export const api = {
  Sudoku: new SudokuService(),
};
