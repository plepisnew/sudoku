import { ReactNode } from "react";
import { HomePage } from "../pages/HomePage";
import { EditorPage } from "@/pages/EditorPage/EditorPage";

export type Route = {
  path: string;
  Component: ReactNode;
};

export const routes: Route[] = [
  {
    path: "/",
    Component: <HomePage />,
  },
  {
    path: "/editor",
    Component: <EditorPage />,
  },
];
