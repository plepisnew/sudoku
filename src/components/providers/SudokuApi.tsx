import { api } from "@/api";
import { Board, SudokuService } from "@/api/Sudoku";
import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

export type SudokuApiContext = {
	boards: Board[];
	addBoard: SudokuService["addBoard"];
	deleteBoard: SudokuService["deleteBoard"];
	updateBoard: SudokuService["updateBoard"];
};

const SudokuApiContext = createContext({} as SudokuApiContext);

export const useSudokuApi = () => useContext(SudokuApiContext);

export const SudokuApiProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [boards, setBoards] = useState<Board[]>([]);

	useEffect(() => {
		setBoards(api.Sudoku.listBoards().payload);
	}, []);

	const context: SudokuApiContext = {
		boards,
		addBoard: (board) => {
			if (!board.name) {
				return { ok: false, error: "Please supply a name for the board" };
			}

			const addBoardResponse = api.Sudoku.addBoard({
				size: board.size,
				type: board.type,
				name: board.name,
				description: board.description ?? "",
				hints: board.hints,
			});

			if (addBoardResponse.ok) {
				setBoards(addBoardResponse.payload.boards);
			}

			return addBoardResponse;
		},
		updateBoard: (board) => {
			if (!board.name) {
				return { ok: false, error: "Please supply a name for the board" };
			}

			const updateResponse = api.Sudoku.updateBoard(board);

			if (updateResponse.ok) {
				setBoards(updateResponse.payload.boards);
			}

			return updateResponse;
		},
		deleteBoard: (id) => {
			const deleteResponse = api.Sudoku.deleteBoard(id);

			if (deleteResponse.ok) {
				setBoards(deleteResponse.payload);
			}

			return deleteResponse;
		},
	};

	return <SudokuApiContext.Provider value={context}>{children}</SudokuApiContext.Provider>;
};
