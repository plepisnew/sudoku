import { SudokuService } from "./Sudoku";

export type ApiResult<
  T = undefined,
  TForceSuccess = false
> = T extends undefined
  ? { ok: boolean }
  : TForceSuccess extends true
  ? { ok: true; payload: T }
  : { ok: true; payload: T } | { ok: false; error: string };

export const api = {
  Sudoku: new SudokuService(),
};
