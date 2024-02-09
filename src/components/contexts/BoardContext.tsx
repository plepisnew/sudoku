import { api } from "@/api";
import { Board, SudokuService } from "@/api/Sudoku";
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

export type BoardContext = {
  boards: Board[];
  listBoards: SudokuService["listBoards"];
  addBoard: SudokuService["addBoard"];
  deleteBoard: SudokuService["deleteBoard"];
};

export const BoardContext = createContext({} as BoardContext);

export const BoardProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    setBoards(api.Sudoku.listBoards().payload);
  }, []);

  const context: BoardContext = {
    boards,
    listBoards: () => {
      const boards = api.Sudoku.listBoards().payload;
      setBoards(boards);

      return { ok: true, payload: boards };
    },
    addBoard: (board) => {
      const addBoardResponse = api.Sudoku.addBoard(board);

      if (!addBoardResponse.ok) {
        return addBoardResponse;
      }

      setBoards(addBoardResponse.payload);

      return addBoardResponse;
    },
    deleteBoard: (id) => {
      const deleteBoardResponse = api.Sudoku.deleteBoard(id);

      if (!deleteBoardResponse.ok) {
        return deleteBoardResponse;
      }

      setBoards(deleteBoardResponse.payload);

      return deleteBoardResponse;
    },
  };

  return (
    <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
  );
};
