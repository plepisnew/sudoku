import { BoardSize, BoardType } from "@/api/Sudoku";
import { useDropdown } from "@/components/hooks/useDropdown";
import { SudokuBoard } from "@/components/sudoku/SudokuBoard";
import { Box } from "@/components/ui/Box";
import { cn } from "@/utils/cn";
import React from "react";

export const EditorPage: React.FC = () => {
  const [boardType, BoardTypeDropdown] = useDropdown(
    [
      {
        value: BoardType.Enum.NORMAL,
        label: "Normal",
      },
      {
        value: BoardType.Enum.JIGSAW,
        label: "Jigsaw",
      },
      {
        value: BoardType.Enum.DIAGONAL,
        label: "Diagonal",
      },
      {
        value: BoardType.Enum.EVEN_ODD,
        label: "Even & Odd",
      },
      {
        value: BoardType.Enum.TENS_FIVES,
        label: "Tens & Fives",
      },
      {
        value: BoardType.Enum.KILLER,
        label: "Killer",
      },
      {
        value: BoardType.Enum.CONSECUTIVE,
        label: "Consecutive",
      },
      {
        value: BoardType.Enum.WINDOKU,
        label: "Windoku",
      },
    ],
    { label: "Board type" }
  );

  const [boardSize, BoardSizeDropdown] = useDropdown(
    [
      {
        value: BoardSize.Enum.SMALL,
        label: "Small (6x6)",
      },
      {
        value: BoardSize.Enum.NORMAL,
        label: "Normal (9x9)",
      },
    ],
    { label: "Board size" }
  );

  return (
    <div className={cn("page-container", "flex flex-col gap-4")}>
      <h1 className={cn("title", "text-3xl")}>Sudoku Editor Dashboard</h1>
      <h2 className={cn("subtitle")}>
        Here you can create your own sudoku boards
      </h2>
      <div className={cn("content-container", "flex gap-4 items-start")}>
        <Box
          className={cn("board-config", "flex flex-col w-[300px] p-0")}
          title="Board configuration"
        >
          {BoardTypeDropdown}
          {BoardSizeDropdown}
        </Box>
        <Box
          className={cn("board-editor", "flex flex-col")}
          title="Board editor"
        >
          <SudokuBoard type={boardType} size={boardSize} />
        </Box>
      </div>
    </div>
  );
};
