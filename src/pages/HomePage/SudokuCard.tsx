import { Board } from "@/api/Sudoku";
import React from "react";

export const SudokuCard: React.FC<Board> = (board) => {
  return <div>sudoku card {board.id}</div>;
};
