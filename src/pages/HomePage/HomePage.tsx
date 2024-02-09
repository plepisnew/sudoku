import { cn } from "@/utils/cn";
import React, { MouseEventHandler, ReactNode, useState } from "react";
import { entropy } from "@/utils/entropy";
import { useBoardsApi } from "@/utils/hooks";
import { SudokuCard } from "./SudokuCard";

export const HomePage: React.FC = () => {
  const boardsApi = useBoardsApi();

  const [randomValue, setRandomValue] = useState<string>(
    entropy.fromAlphabet((e) => e.alpha, 5)
  );

  const handleClickRandomValue: MouseEventHandler = () => {
    setRandomValue(entropy.fromAlphabet((e) => e.alpha, 5));
  };

  const Highlight = (text: ReactNode) => (
    <span
      onClick={handleClickRandomValue}
      className={cn(
        "px-1 py-1",
        "border border-zinc-500 font-mono rounded-md bg-zinc-500/15 shadow-md",
        "hover:bg-zinc-500/20 active:bg-zinc-500/25 transition-colors",
        "cursor-pointer select-none"
      )}
    >
      {text}
    </span>
  );

  return (
    <div className={cn("flex flex-col gap-4 items-start")}>
      <h1 className={cn("text-3xl")}>
        Welcome, <b>Ansis</b>!
      </h1>
      <h2>Here are your boards, bitch. Also {Highlight(randomValue)}</h2>
      <div className={cn("grid grid-cols-2")}>
        {boardsApi.boards.map((board) => (
          <SudokuCard {...board} />
        ))}
      </div>
    </div>
  );
};
