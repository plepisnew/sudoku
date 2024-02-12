import { Board, BoardSize, BoardType, CellIndexes, Mark, SudokuConstants } from "@/api/Sudoku";
import { cn } from "@/utils/cn";
import { ArrayFilter, Setter } from "@/utils/types";
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

export const BoardStyle = z.enum(["NORMAL", "MINIMAL", "INFORMAL"]);

export const BoardMode = z.enum(["SOLVE", "EDIT", "STATIC"]);

export type CellCoordinates = { x: number; y: number };

export type PencilMark = CellIndexes & { centered: boolean; values: number[] };

// prettier-ignore
export type SudokuBoardProps = {
  type?: Board["type"];
  size?: Board["size"];
  className?: string;
  onHoverCell?: (context: CellContext & { event: React.MouseEvent<HTMLDivElement, MouseEvent> }) => void;
  onClickCell?: (context: CellContext & { event: React.MouseEvent<HTMLDivElement, MouseEvent> }) => void;
  onControlClickCell?: (context: CellContext & { event: React.MouseEvent<HTMLDivElement, MouseEvent> }) => void;
  onShiftClickCell?: (context: CellContext & { event: React.MouseEvent<HTMLDivElement, MouseEvent> }) => void;
  mode?: z.infer<typeof BoardMode>;
  style?: z.infer<typeof BoardStyle>;
  hints: Mark[];
	setHints: Setter<Mark[]>;
};

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
	className,
	size = BoardSize.Enum.NORMAL,
	type = BoardType.Enum.NORMAL,
	mode = BoardMode.Enum.SOLVE,
	style = BoardStyle.Enum.NORMAL,
	hints,
	setHints,
	onHoverCell,
	onClickCell,
	onControlClickCell,
	onShiftClickCell,
}) => {
	const [mouseDown, setMouseDown] = useState<boolean>(false);
	const [eraseMode, setEraseMode] = useState<boolean>(false);
	const [selectedCells, setSelectedCells] = useState<CellIndexes[]>([]);
	const [pencilMarks, setPencilMarks] = useState<PencilMark[]>([]);
	const [marks, setMarks] = useState<Mark[]>([]);

	useEffect(() => {
		// setSelectedCells([]);
		// setPencilMarks([]);
		// setMarks([]);

		const mouseUpHandler = () => setMouseDown(false);

		document.addEventListener("mouseup", mouseUpHandler);

		return () => {
			document.removeEventListener("mouseup", mouseUpHandler);
		};
	}, [size, type]);

	const boardWidth = SudokuConstants.Blocks[size].WIDTH * SudokuConstants.Blocks[size].COUNT_X;
	const boardHeight = SudokuConstants.Blocks[size].HEIGHT * SudokuConstants.Blocks[size].COUNT_Y;

	/**
	 * Analyzes the passed cell and returns information about its neighbors and whether it is currently being selected.
	 * @param cellIndexes Block and Cell indexes of the specific cell to analyze
	 * @returns
	 */
	const analyzeCellPosition = ({ blockIndex, cellIndex }: CellIndexes) => {
		const { x, y } = indexesToCoordinates({ blockIndex, cellIndex });

		let hasTop = false;
		let hasBottom = false;
		let hasLeft = false;
		let hasRight = false;

		for (const cell of selectedCells) {
			const coordinates = indexesToCoordinates({
				blockIndex: cell.blockIndex,
				cellIndex: cell.cellIndex,
			});

			hasTop ||= y !== 0 && coordinates.x === x && coordinates.y === y - 1;
			hasBottom ||= y !== boardHeight - 1 && coordinates.x === x && coordinates.y === y + 1;
			hasLeft ||= x !== 0 && coordinates.x === x - 1 && coordinates.y === y;
			hasRight ||= x !== boardWidth - 1 && coordinates.x === x + 1 && coordinates.y === y;
		}

		return {
			isSelected: selectedCells.some(
				(cell) => blockIndex === cell.blockIndex && cellIndex === cell.cellIndex,
			),
			hasTop,
			hasBottom,
			hasLeft,
			hasRight,
		};
	};

	/**
	 * Converts BLock and Cell indexes into board coordinates (x, y)
	 * @param cellIndexes Block and Cell indexes of the cell
	 * @returns x and y coordinates of the passed cell
	 */
	const indexesToCoordinates = ({ blockIndex, cellIndex }: CellIndexes): CellCoordinates => {
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

	/**
	 * Converts board coordinates into BLock and Cell indexes
	 * @param coordinates x and y positions of the cell relative to the board
	 * @returns Block and Cell indexes of the passed cell
	 */
	const coordinatesToIndexes = ({ x, y }: CellCoordinates): CellIndexes => {
		const topOrder =
			(y - (y % SudokuConstants.Blocks[size].HEIGHT)) / SudokuConstants.Blocks[size].HEIGHT;
		const leftOrder =
			(x - (x % SudokuConstants.Blocks[size].WIDTH)) / SudokuConstants.Blocks[size].WIDTH;

		return {
			blockIndex: topOrder * SudokuConstants.Blocks[size].COUNT_X + leftOrder,
			cellIndex:
				(x % SudokuConstants.Blocks[size].WIDTH) +
				(y % SudokuConstants.Blocks[size].HEIGHT) * SudokuConstants.Blocks[size].WIDTH,
		};
	};

	/**
	 * Toggles the passed cell by selecting it if its unselected and vice verse
	 * @param cellIndexes Block and Cell indexes of the cell
	 * @param options Specifies options for preventing erase or add events
	 * @returns boolean indicating whether cell was selected (true) or unselected (false)
	 */
	const toggleCellSelection = (
		{ blockIndex, cellIndex }: CellIndexes,
		options?: { disableErase?: boolean; disableAdd?: boolean },
	): boolean => {
		const filteredCells = selectedCells.filter(
			(cell) => blockIndex !== cell.blockIndex || cellIndex !== cell.cellIndex,
		);

		if (filteredCells.length === selectedCells.length) {
			if (!options?.disableAdd) {
				setSelectedCells([...selectedCells, { blockIndex, cellIndex }]);
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

	/**
	 * Utility function for ease of cell comparison in callbacks
	 * @param cell1 The cell which is to be compared
	 * @returns Callback which can be used to compare a variable cell to the provided cell
	 */
	const getCellComparer = (cell1: CellIndexes) => (cell2: CellIndexes) =>
		cell1.blockIndex === cell2.blockIndex && cell1.cellIndex === cell2.cellIndex;

	/**
	 * Utility object for mapping keyboard key codes to corresponding values in a sudoku board
	 */
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

	/**
	 * Writes pencil marks of the specified kind at the selected cells
	 * @param centered Whether the pencil marks should be centered
	 * @param value The value to be written (if any). Nullable because an action may consist of only changing the centering of the pencil marks
	 */
	const writePencilMarks = (centered: boolean, value?: number) => {
		// True if every cell in the selection already contains the value to be be written
		const shouldErasePencilMarks = selectedCells.reduce((shouldErase, selectedCell) => {
			const pencilMark = pencilMarks.find(getCellComparer(selectedCell));

			return (
				shouldErase &&
				pencilMark !== undefined &&
				value !== undefined &&
				pencilMark.values.includes(value)
			);
		}, true);

		// Pencil marks outside of the selection
		const unselectedPencilMarks: PencilMark[] = pencilMarks.filter(
			(pencilMark) => !selectedCells.some(getCellComparer(pencilMark)),
		);

		// Pencil marks inside the selection
		const existingPencilMarks: PencilMark[] = pencilMarks
			.filter((pencilMark) => selectedCells.some(getCellComparer(pencilMark)))
			.map((cell) => {
				const isValueWritten = value !== undefined && cell.values.includes(value);

				const values = isValueWritten
					? cell.values
					: [...cell.values, ...(value !== undefined ? [value] : [])];

				return { ...cell, centered, values };
			});

		// Regular (non-pencil mark) cells inside the selection
		const newPencilMarks: PencilMark[] =
			value === undefined
				? []
				: selectedCells
						.filter((selectedCell) => !pencilMarks.some(getCellComparer(selectedCell)))
						.map((cell) => ({ ...cell, centered, values: [value] }));

		if (shouldErasePencilMarks) {
			return setPencilMarks(
				pencilMarks.map((pencilMark) => {
					// Pencil marks outside the selection stay as is
					if (!selectedCells.some(getCellComparer(pencilMark))) {
						return pencilMark;
					}

					// Pencil marks with only the writable value get removed
					if (pencilMark.values.length === 1 && pencilMark.values.at(0) === value) {
						return { ...pencilMark, values: [] };
					}

					// Otherwise all marks in the pencil mark containing the writable value are removed
					return { ...pencilMark, values: pencilMark.values.filter((_value) => _value !== value) };
				}),
			);
		}

		setPencilMarks([...unselectedPencilMarks, ...existingPencilMarks, ...newPencilMarks]);
	};

	/**
	 * Writes marks of the specified value at the selected cells
	 * @param value The value to be written
	 */
	const writeMarks = (value: number) => {
		// True if every cell in the selection already contains the value to be be written
		const shouldEraseMarks = selectedCells.reduce((shouldErase, selectedCell) => {
			const mark = marks.find(getCellComparer(selectedCell));

			return shouldErase && mark !== undefined && mark.value === value;
		}, true);

		if (shouldEraseMarks) {
			return setMarks(marks.filter((mark) => !selectedCells.some(getCellComparer(mark))));
		}

		const unselectedMarks: Mark[] = marks.filter(
			(mark) => !selectedCells.some(getCellComparer(mark)),
		);

		const existingMarks: Mark[] = marks
			.filter((mark) => selectedCells.some(getCellComparer(mark)))
			.map((mark) => ({ ...mark, value }));

		const newMarks: Mark[] = selectedCells
			.filter((selectedCell) => !marks.some(getCellComparer(selectedCell)))
			.map((cell) => ({ ...cell, value }));

		setMarks([...unselectedMarks, ...existingMarks, ...newMarks]);
	};

	/**
	 * Utility object for storing applied class names to each Sudoku board component based on the current board style
	 */
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
					cellPosition.isSelected && "bg-zinc-200/70",
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
					},
				);
			},
			block: "border border-zinc-400",
			grid: "border-[3px] border-zinc-400 rounded-sm",
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

	/**
	 * Creates a dynamic mouse down event handler for the specified Block and Cell indexes
	 * @param indexes Block and Cell indexes of the cell to which the handler is attached
	 * @returns The event handler
	 */
	const getMouseDownCellHandler: (indexes: CellIndexes) => MouseEventHandler<HTMLDivElement> =
		({ blockIndex, cellIndex }) =>
		(e) => {
			setMouseDown(true);

			const cellContext = { blockIndex, cellIndex, event: e };

			const handleControlClick = () => {
				const didAdd = toggleCellSelection({ blockIndex, cellIndex });

				setEraseMode(!didAdd);
			};

			const handleShiftClick = () => {
				const latestCell = selectedCells.at(-1);

				if (latestCell === undefined) {
					return setSelectedCells([{ blockIndex, cellIndex }]);
				}

				const latestCoordinates = indexesToCoordinates({
					blockIndex: latestCell.blockIndex,
					cellIndex: latestCell.cellIndex,
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
								(cell) => blockIndex === cell.blockIndex && cellIndex === cell.cellIndex,
							)
						) {
							const newIndexes = coordinatesToIndexes({ x, y });
							newCells.push({
								blockIndex: newIndexes.blockIndex,
								cellIndex: newIndexes.cellIndex,
							});
						}
					}
				}

				setSelectedCells([...selectedCells, ...newCells, { blockIndex, cellIndex }]);
			};

			const handleNormalClick = () => {
				if (
					selectedCells.length === 1 &&
					getCellComparer(selectedCells.at(0)!)({ blockIndex, cellIndex })
				) {
					return setSelectedCells([]);
				}
				setSelectedCells([{ blockIndex, cellIndex }]);
				setEraseMode(false);
			};

			switch (mode) {
				case BoardMode.Enum.STATIC:
					return;
				case BoardMode.Enum.SOLVE:
					if (e.ctrlKey) {
						handleControlClick();
					} else if (e.shiftKey) {
						handleShiftClick();
					} else {
						handleNormalClick();
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

	/**
	 * Creates a dynamic mouse enter event handler for the specified Block and Cell indexes
	 * @param indexes Block and Cell indexes of the cell to which the handler is attached
	 * @returns The event handler
	 */
	const getMouseEnterHandler: (indexes: CellIndexes) => MouseEventHandler<HTMLDivElement> =
		({ blockIndex, cellIndex }) =>
		(e) => {
			const cellContext = { blockIndex, cellIndex, event: e };

			switch (mode) {
				case BoardMode.Enum.STATIC:
					break;
				case BoardMode.Enum.SOLVE:
					if (mouseDown) {
						toggleCellSelection(
							{ blockIndex, cellIndex },
							{ disableAdd: eraseMode, disableErase: !eraseMode },
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

	/**
	 * Creates a global keyboard event handler
	 * @returns The global keyboard event handler
	 */
	const getKeyDownCellHandler: () => KeyboardEventHandler<HTMLDivElement> = () => (e) => {
		const writableValue = keyboardKeyValues[e.code];
		const shouldWriteValue = writableValue !== undefined;

		const handleNonWritableInput = () => {
			const latestCell = selectedCells.at(-1);

			if (latestCell === undefined) {
				return;
			}

			const { x, y } = indexesToCoordinates(latestCell);
			const previousCells = e.ctrlKey ? selectedCells : [];

			const cellFilterer: ArrayFilter<CellIndexes> = (cell) =>
				!selectedCells.some(getCellComparer(cell));

			switch (e.key) {
				case "Shift":
					writePencilMarks(false);
					break;
				case "Control":
					writePencilMarks(true);
					break;
				case "Backspace":
					if (e.shiftKey || e.ctrlKey) {
						setPencilMarks(pencilMarks.filter(cellFilterer));
					} else {
						setMarks(marks.filter((mark) => !selectedCells.some(getCellComparer(mark))));
					}
					break;
				case "ArrowUp":
					return (
						y !== 0 && setSelectedCells([...previousCells, coordinatesToIndexes({ x, y: y - 1 })])
					);
				case "ArrowRight":
					return (
						x !== boardWidth - 1 &&
						setSelectedCells([...previousCells, coordinatesToIndexes({ x: x + 1, y })])
					);
				case "ArrowDown":
					return (
						y !== boardHeight - 1 &&
						setSelectedCells([...previousCells, coordinatesToIndexes({ x, y: y + 1 })])
					);
				case "ArrowLeft":
					return (
						x !== 0 && setSelectedCells([...previousCells, coordinatesToIndexes({ x: x - 1, y })])
					);
				default:
					return;
			}
		};

		if (!shouldWriteValue) {
			return handleNonWritableInput();
		}

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

	/**
	 * Creates the contents of a pencil mark based on whether it is centered and what values it has
	 * @param cellIndexes Block and Cell indexes of the cell to be painted as a pencil mark
	 * @returns Renderable node corresponding to the pencil mark contents
	 */
	const PencilMarkContents = ({ blockIndex, cellIndex }: CellIndexes): ReactNode => {
		const pencilMark = pencilMarks.find(
			(mark) => mark.blockIndex === blockIndex && mark.cellIndex === cellIndex,
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
					length: SudokuConstants.Blocks[size].WIDTH * SudokuConstants.Blocks[size].HEIGHT,
				}).map((_, index) => (
					<span key={index} className={cn("pencil-mark-cell", "flex items-center justify-center")}>
						{pencilMark.values.find((value) => value === index + 1)}
					</span>
				))}
			</div>
		);
	};

	/**
	 * Template for creating a cell node
	 * @param cellIndexes Block and Cell indexes of the cell to render
	 * @returns Renderable node corresponding to the cell
	 */
	const CreateCell = ({ blockIndex, cellIndex }: CellIndexes) => (
		<div
			key={cellIndex}
			className={cn(
				"sudoku-cell",
				"flex justify-center items-center relative select-none",
				"text-3xl font-mono",
				StyleClassNames[style].cell({ blockIndex, cellIndex }),
			)}
			tabIndex={0}
			style={{
				width: SudokuConstants.Cells.SIZE,
				height: SudokuConstants.Cells.SIZE,
			}}
			onMouseEnter={getMouseEnterHandler({ blockIndex, cellIndex })}
			onMouseDown={getMouseDownCellHandler({ blockIndex, cellIndex })}
		>
			<div
				className={cn(
					"sudoku-cell-overlay",
					"absolute top-0 left-0 h-full w-full -z-1 text-sm",
					StyleClassNames[style].cellOverlay({ blockIndex, cellIndex }),
				)}
			>
				{!marks.some(getCellComparer({ blockIndex, cellIndex })) &&
					PencilMarkContents({ cellIndex, blockIndex })}
			</div>
			{hints.find(getCellComparer({ blockIndex, cellIndex }))?.value ??
				marks.find(getCellComparer({ blockIndex, cellIndex }))?.value}
		</div>
	);

	/**
	 * Template for creating a block node
	 * @param blockIndex Block index of the block to render
	 * @returns Renderable node corresponding to the block
	 */
	const CreateBlock = (blockIndex: number) => (
		<div
			key={blockIndex}
			className={cn("sudoku-block", "grid", StyleClassNames[style].block)}
			style={{
				gridTemplateColumns: `repeat(${SudokuConstants.Blocks[size].WIDTH}, 1fr)`,
				gridTemplateRows: `repeat(${SudokuConstants.Blocks[size].HEIGHT}, 1fr)`,
			}}
		>
			{Array.from({
				length: SudokuConstants.Blocks[size].WIDTH * SudokuConstants.Blocks[size].HEIGHT,
			}).map((_, cellIndex) => CreateCell({ blockIndex, cellIndex }))}
		</div>
	);

	/**
	 * Grid node containing a set of blocks
	 */
	const Grid = (
		<div
			className={cn("sudoku-grid", "grid", StyleClassNames[style].grid)}
			style={{
				gridTemplateColumns: `repeat(${SudokuConstants.Blocks[size].COUNT_X}, 1fr)`,
				gridTemplateRows: `repeat(${SudokuConstants.Blocks[size].COUNT_Y}, 1fr)`,
			}}
		>
			{Array.from({
				length: SudokuConstants.Blocks[size].COUNT_X * SudokuConstants.Blocks[size].COUNT_Y,
			}).map((_, blockIndex) => CreateBlock(blockIndex))}
		</div>
	);

	return (
		<div onKeyDown={getKeyDownCellHandler()} className={cn("sudoku-grid", "grid", className)}>
			{Grid}
		</div>
	);
};
