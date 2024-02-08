import { api } from "@/api";
import { cn } from "@/utils/cn";
import React from "react";

export const HomePage: React.FC = () => {
  return (
    <div className={cn("flex flex-col gap-4 items-start")}>
      <h1 className={cn("text-3xl")}>
        Welcome, <b>Ansis</b>!
      </h1>
      <button onClick={api.Sudoku.listBoards}>List boards</button>
      <div></div>
    </div>
  );
};
