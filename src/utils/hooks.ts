import { BoardContext } from "@/components/contexts/BoardContext";
import { useContext } from "react";

export const useBoardsApi = () => useContext(BoardContext);
