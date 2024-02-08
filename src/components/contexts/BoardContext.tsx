import { api } from "@/api";
import { Board } from "@/api/Sudoku";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type BoardContext = {
  boards: Board[];
};

export const BoardContext = createContext({});

export const useBoardsApi = () => useContext(BoardContext);

export const BoardProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    setBoards(api.Sudoku.list());
  }, []);

  return (
    <BoardContext.Provider
      value={{
        boards,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
