import {
  Board,
  SudokuConstants,
  normalBoardCellValueSchema,
} from "@/api/Sudoku";
import { cn } from "@/utils/cn";
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { z } from "zod";

type CellContext = {
  blockIndex: number;
  cellIndex: number;
};

const BoardStyle = z.enum(["NORMAL", "MINIMAL", "INFORMAL"]);

const BoardMode = z.enum(["SOLVE", "EDIT", "STATIC"]);

type CellIndexes = { blockIndex: number; cellIndex: number };

type CellCoordinates = { x: number; y: number };

// prettier-ignore
export type SudokuBoardProps = {
  type: Board["type"];
  size: Board["size"];
  className?: string;
  onHoverCell?: (context: CellContext & { event: React.MouseEvent<HTMLDivElement, MouseEvent> }) => void;
  onClickCell?: (context: CellContext & { event: React.MouseEvent<HTMLDivElement, MouseEvent> }) => void;
  onControlClickCell?: (context: CellContext & { event: React.MouseEvent<HTMLDivElement, MouseEvent> }) => void;
  onShiftClickCell?: (context: CellContext & { event: React.MouseEvent<HTMLDivElement, MouseEvent> }) => void;
  mode?: z.infer<typeof BoardMode>;
};

type SelectedCell = [number, number];

type PencilMark = {
  centered: boolean;
  blockIndex: number;
  cellIndex: number;
  values: number[];
};

type Mark = { blockIndex: number; cellIndex: number; value: number };

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  className,
  size,
  type,
  onHoverCell,
  onClickCell,
  onControlClickCell,
  onShiftClickCell,
  mode = BoardMode.Enum.SOLVE,
}) => {
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [eraseMode, setEraseMode] = useState<boolean>(false);

  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const [pencilMarks, setPencilMarks] = useState<PencilMark[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    setSelectedCells([]);

    const mouseUpHandler = () => setMouseDown(false);

    document.addEventListener("mouseup", mouseUpHandler);

    return () => {
      document.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [size, type]);

  // prettier-ignore
  const boardWidth = SudokuConstants.Blocks[size].WIDTH * SudokuConstants.Blocks[size].COUNT_X;
  // prettier-ignore
  const boardHeight = SudokuConstants.Blocks[size].HEIGHT * SudokuConstants.Blocks[size].COUNT_Y;

  const boardStyle = BoardStyle.Enum.NORMAL;

  const analyzeCellPosition = ({ blockIndex, cellIndex }: CellIndexes) => {
    const { x, y } = indexesToCoordinates({ blockIndex, cellIndex });

    let hasTop = false;
    let hasBottom = false;
    let hasLeft = false;
    let hasRight = false;

    for (const [_blockIndex, _cellIndex] of selectedCells) {
      const coordinates = indexesToCoordinates({
        blockIndex: _blockIndex,
        cellIndex: _cellIndex,
      });

      hasTop ||= y !== 0 && coordinates.x === x && coordinates.y === y - 1;
      hasBottom ||=
        y !== boardHeight - 1 && coordinates.x === x && coordinates.y === y + 1;
      hasLeft ||= x !== 0 && coordinates.x === x - 1 && coordinates.y === y;
      hasRight ||=
        x !== boardWidth - 1 && coordinates.x === x + 1 && coordinates.y === y;
    }

    return {
      isSelected: selectedCells.some(
        ([_blockIndex, _cellIndex]) =>
          blockIndex === _blockIndex && cellIndex === _cellIndex
      ),
      hasTop,
      hasBottom,
      hasLeft,
      hasRight,
    };
  };

  const indexesToCoordinates = ({
    blockIndex,
    cellIndex,
  }: CellIndexes): CellCoordinates => {
    const blocksToLeft = blockIndex % SudokuConstants.Blocks[size].COUNT_X;
    const baseX = blocksToLeft * SudokuConstants.Blocks[size].WIDTH;
    const localX = cellIndex % SudokuConstants.Blocks[size].WIDTH;

    const blocksToTop =
      (blockIndex - (blockIndex % SudokuConstants.Blocks[size].COUNT_X)) /
      SudokuConstants.Blocks[size].COUNT_X;
    const baseY = blocksToTop * SudokuConstants.Blocks[size].HEIGHT;
    const localY =
      (cellIndex - (cellIndex % SudokuConstants.Blocks[size].WIDTH)) /
      SudokuConstants.Blocks[size].WIDTH;

    return { x: baseX + localX, y: baseY + localY };
  };

  const coordinatesToIndexes = ({ x, y }: CellCoordinates): CellIndexes => {
    const topOrder =
      (y - (y % SudokuConstants.Blocks[size].HEIGHT)) /
      SudokuConstants.Blocks[size].HEIGHT;
    const leftOrder =
      (x - (x % SudokuConstants.Blocks[size].WIDTH)) /
      SudokuConstants.Blocks[size].WIDTH;

    return {
      blockIndex: topOrder * SudokuConstants.Blocks[size].COUNT_X + leftOrder,
      cellIndex:
        (x % SudokuConstants.Blocks[size].WIDTH) +
        (y % SudokuConstants.Blocks[size].HEIGHT) *
          SudokuConstants.Blocks[size].WIDTH,
    };
  };

  const toggleCell = (
    { blockIndex, cellIndex }: CellIndexes,
    options?: { disableErase?: boolean; disableAdd?: boolean }
  ): boolean => {
    const filteredCells = selectedCells.filter(
      ([_blockIndex, _cellIndex]) =>
        _blockIndex !== blockIndex || _cellIndex !== cellIndex
    );

    if (filteredCells.length === selectedCells.length) {
      if (!options?.disableAdd) {
        setSelectedCells([...selectedCells, [blockIndex, cellIndex]]);
        return true;
      }
    } else {
      if (!options?.disableErase) {
        setSelectedCells(filteredCells);
        return false;
      }
    }

    return false;
  };

  const keyboardKeyValues: Record<string, number> = {
    Digit1: 1,
    Digit2: 2,
    Digit3: 3,
    Digit4: 4,
    Digit5: 5,
    Digit6: 6,
    Digit7: 7,
    Digit8: 8,
    Digit9: 9,
  };

  const writePencilMarks = (centered: boolean, value?: number) => {
    const pencilMarksNotInSelection: PencilMark[] = pencilMarks.filter(
      (pencilMark) => {
        return !selectedCells.some(
          ([_blockIndex, _cellIndex]) =>
            pencilMark.blockIndex === _blockIndex &&
            pencilMark.cellIndex === _cellIndex
        );
      }
    );

    // TODO fix intersections
    const isValueInSelection =
      value &&
      selectedCells.some(([_blockIndex, _cellIndex]) =>
        pencilMarks
          .find(
            (pencilMark) =>
              pencilMark.blockIndex === _blockIndex &&
              pencilMark.cellIndex === _cellIndex
          )
          ?.values.includes(value)
      );

    const pencilMarksInSelection: PencilMark[] = selectedCells.map(
      ([_blockIndex, _cellIndex]) => {
        const existingPencilMark = pencilMarks.find(
          (pencilMark) =>
            pencilMark.blockIndex === _blockIndex &&
            pencilMark.cellIndex === _cellIndex
        );

        const newValues = existingPencilMark
          ? value
            ? existingPencilMark.values.includes(value)
              ? existingPencilMark.values.filter((v) => v !== value)
              : [...existingPencilMark.values, value]
            : existingPencilMark.values
          : value
          ? [value]
          : [];

        return {
          blockIndex: _blockIndex,
          cellIndex: _cellIndex,
          centered,
          values: newValues,
        };
      }
    );

    setPencilMarks([...pencilMarksNotInSelection, ...pencilMarksInSelection]);
  };

  const writeMarks = (value: number) => {
    const marksNotInSelection: Mark[] = marks.filter((mark) => {
      return !selectedCells.some(
        ([_blockIndex, _cellIndex]) =>
          mark.blockIndex === _blockIndex && mark.cellIndex === _cellIndex
      );
    });

    const marksInSelection: Mark[] = selectedCells.filter.map(
      ([_blockIndex, _cellIndex]) => {
        const existingMark = marks.find(
          (mark) =>
            mark.blockIndex === _blockIndex && mark.cellIndex === _cellIndex
        );

        return {
          blockIndex: _blockIndex,
          cellIndex: _cellIndex,
          value,
        };
      }
    );

    setMarks([...marksNotInSelection, ...marksInSelection]);
  };

  const StyleClassNames: Record<
    keyof typeof BoardStyle.Enum,
    {
      cell: (cellIndexes: CellIndexes) => string;
      cellOverlay: (cellIndexes: CellIndexes) => string;
      block: string;
      grid: string;
    }
  > = {
    [BoardStyle.Enum.NORMAL]: {
      cell: ({ blockIndex, cellIndex }: CellIndexes) => {
        const cellPosition = analyzeCellPosition({ blockIndex, cellIndex });
        return cn(
          "bg-white border border-zinc-400 select-none transition-colors",
          mode !== BoardMode.Enum.STATIC && "cursor-pointer",
          cellPosition.isSelected && "bg-zinc-200/70"
        );
      },
      cellOverlay: ({ blockIndex, cellIndex }: CellIndexes) => {
        const cellPosition = analyzeCellPosition({ blockIndex, cellIndex });

        return cn(
          "border-zinc-500",
          cellPosition.isSelected && {
            "border-t": !cellPosition.hasTop,
            "border-r": !cellPosition.hasRight,
            "border-b": !cellPosition.hasBottom,
            "border-l": !cellPosition.hasLeft,
          }
        );
      },
      block: "border border-zinc-400",
      grid: "border-[3px] border-zinc-400 rounded-md",
    },
    [BoardStyle.Enum.INFORMAL]: {
      cell: () => "",
      cellOverlay: () => "",
      block: "",
      grid: "",
    },
    [BoardStyle.Enum.MINIMAL]: {
      cell: () => "",
      cellOverlay: () => "",
      block: "",
      grid: "",
    },
  };

  const getMouseDownCellHandler: (
    cellIndex: number,
    blockIndex: number
  ) => MouseEventHandler<HTMLDivElement> = (blockIndex, cellIndex) => (e) => {
    setMouseDown(true);

    const cellContext = { blockIndex, cellIndex, event: e };

    switch (mode) {
      case BoardMode.Enum.STATIC:
        return;
      case BoardMode.Enum.SOLVE:
        if (e.ctrlKey) {
          const didAdd = toggleCell({ blockIndex, cellIndex });

          setEraseMode(!didAdd);
        } else if (e.shiftKey) {
          const latestCell = selectedCells.at(-1);

          if (latestCell === undefined) {
            setSelectedCells([[blockIndex, cellIndex]]);
          } else {
            const latestCoordinates = indexesToCoordinates({
              blockIndex: latestCell[0],
              cellIndex: latestCell[1],
            });
            const currentCoordinates = indexesToCoordinates({
              blockIndex,
              cellIndex,
            });
            const minX = Math.min(latestCoordinates.x, currentCoordinates.x);
            const minY = Math.min(latestCoordinates.y, currentCoordinates.y);
            const maxX = Math.max(latestCoordinates.x, currentCoordinates.x);
            const maxY = Math.max(latestCoordinates.y, currentCoordinates.y);
            const newCells: typeof selectedCells = [];

            for (let x = minX; x <= maxX; x++) {
              for (let y = minY; y <= maxY; y++) {
                if (x === currentCoordinates.x && y === currentCoordinates.y) {
                  continue;
                }
                if (
                  !selectedCells.some(
                    ([_blockIndex, _cellIndex]) =>
                      blockIndex === _blockIndex && cellIndex === _cellIndex
                  )
                ) {
                  const newIndexes = coordinatesToIndexes({ x, y });
                  newCells.push([newIndexes.blockIndex, newIndexes.cellIndex]);
                }
              }
            }

            setSelectedCells([
              ...selectedCells,
              ...newCells,
              [blockIndex, cellIndex],
            ]);
          }
        } else {
          setSelectedCells([[blockIndex, cellIndex]]);

          const targetCell = selectedCells.find(
            ([_blockIndex, _cellIndex]) =>
              blockIndex === _blockIndex && cellIndex === _cellIndex
          );

          if (targetCell === undefined) {
            setSelectedCells([[blockIndex, cellIndex]]);
            setEraseMode(false);
          } else if (selectedCells.length === 1) {
            setSelectedCells([]);
            setEraseMode(true);
          } else {
            setSelectedCells([[blockIndex, cellIndex]]);
            setEraseMode(false);
          }
        }
        break;
      case BoardMode.Enum.EDIT:
        if (e.ctrlKey && onControlClickCell) {
          onControlClickCell(cellContext);
        } else if (e.shiftKey && onShiftClickCell) {
          onShiftClickCell(cellContext);
        } else if (onClickCell) {
          onClickCell(cellContext);
        }
        break;
    }
  };

  const getMouseEnterHandler: (
    cellIndex: number,
    blockIndex: number
  ) => MouseEventHandler<HTMLDivElement> = (blockIndex, cellIndex) => (e) => {
    const cellContext = { blockIndex, cellIndex, event: e };

    switch (mode) {
      case BoardMode.Enum.STATIC:
        break;
      case BoardMode.Enum.SOLVE:
        if (mouseDown) {
          toggleCell(
            { blockIndex, cellIndex },
            { disableAdd: eraseMode, disableErase: !eraseMode }
          );
        }
        break;
      case BoardMode.Enum.EDIT:
        if (onHoverCell) {
          onHoverCell(cellContext);
        }
        break;
    }
  };

  const getKeyDownCellHandler: (
    cellIndex: number,
    blockIndex: number
  ) => KeyboardEventHandler<HTMLDivElement> =
    (blockIndex, cellIndex) => (e) => {
      const cellContext = { blockIndex, cellIndex, event: e };
      const writableValue = keyboardKeyValues[e.code];
      const shouldWriteValue = writableValue !== undefined;

      switch (mode) {
        case BoardMode.Enum.STATIC:
          return;
        case BoardMode.Enum.EDIT:
          break;
        case BoardMode.Enum.SOLVE:
          if (e.shiftKey) {
            writePencilMarks(false, writableValue);
          } else if (e.ctrlKey) {
            writePencilMarks(true, writableValue);
          } else if (shouldWriteValue) {
            writeMarks(writableValue);
          }
          break;
        default:
          return;
      }
    };

  const PencilMarkContents = ({
    blockIndex,
    cellIndex,
  }: CellIndexes): ReactNode => {
    const pencilMark = pencilMarks.find(
      (mark) => mark.blockIndex === blockIndex && mark.cellIndex === cellIndex
    );

    if (pencilMark === undefined) {
      return "";
    }

    if (pencilMark.centered) {
      return (
        <div className={cn("flex items-center justify-center h-full")}>
          {pencilMark.values.sort((a, b) => a - b).join("")}
        </div>
      );
    }

    return (
      <div
        className={cn("grid h-full")}
        style={{
          gridTemplateColumns: `repeat(${SudokuConstants.Blocks[size].WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${SudokuConstants.Blocks[size].HEIGHT}, 1fr)`,
        }}
      >
        {Array.from({
          length:
            SudokuConstants.Blocks[size].WIDTH *
            SudokuConstants.Blocks[size].HEIGHT,
        }).map((_, index) => (
          <span
            className={cn(
              "pencil-mark-cell",
              "flex items-center justify-center"
            )}
          >
            {pencilMark.values.find((value) => value === index + 1)}
          </span>
        ))}
      </div>
    );
  };

  const CreateCell = (blockIndex: number, cellIndex: number) => (
    <div
      key={cellIndex}
      className={cn(
        "sudoku-cell",
        "flex justify-center items-center relative",
        "text-3xl",
        StyleClassNames[boardStyle].cell({ blockIndex, cellIndex })
      )}
      tabIndex={0}
      style={{
        width: SudokuConstants.Cells.SIZE,
        height: SudokuConstants.Cells.SIZE,
      }}
      onKeyDown={getKeyDownCellHandler(blockIndex, cellIndex)}
      onMouseEnter={getMouseEnterHandler(blockIndex, cellIndex)}
      onMouseDown={getMouseDownCellHandler(blockIndex, cellIndex)}
    >
      <div
        className={cn(
          "sudoku-cell-overlay",
          "absolute top-0 left-0 h-full w-full -z-1 text-sm",
          StyleClassNames[boardStyle].cellOverlay({ blockIndex, cellIndex })
        )}
      >
        {PencilMarkContents({ cellIndex, blockIndex })}
      </div>
      {
        marks.find(
          (mark) =>
            mark.blockIndex === blockIndex && mark.cellIndex === cellIndex
        )?.value
      }
    </div>
  );

  const CreateBlock = (blockIndex: number) => (
    <div
      key={blockIndex}
      className={cn("sudoku-block", "grid", StyleClassNames[boardStyle].block)}
      style={{
        gridTemplateColumns: `repeat(${SudokuConstants.Blocks[size].WIDTH}, 1fr)`,
        gridTemplateRows: `repeat(${SudokuConstants.Blocks[size].HEIGHT}, 1fr)`,
      }}
    >
      {Array.from({
        length:
          SudokuConstants.Blocks[size].WIDTH *
          SudokuConstants.Blocks[size].HEIGHT,
      }).map((_, cellIndex) => CreateCell(blockIndex, cellIndex))}
    </div>
  );

  const Grid = (
    <div
      className={cn("sudoku-grid", "grid", StyleClassNames[boardStyle].grid)}
      style={{
        gridTemplateColumns: `repeat(${SudokuConstants.Blocks[size].COUNT_X}, 1fr)`,
        gridTemplateRows: `repeat(${SudokuConstants.Blocks[size].COUNT_Y}, 1fr)`,
      }}
    >
      {Array.from({
        length:
          SudokuConstants.Blocks[size].COUNT_X *
          SudokuConstants.Blocks[size].COUNT_Y,
      }).map((_, blockIndex) => CreateBlock(blockIndex))}
    </div>
  );

  return <div className={cn("grid", "", className)}>{Grid}</div>;
};
