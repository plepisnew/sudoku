import { ReactNode } from "react";
import { HomePage } from "../pages/HomePage";
import { EditorPage, EditorPageConstants } from "@/pages/EditorPage/EditorPage";
import { HomePageConstants } from "@/pages/HomePage/HomePage";

export type Route = {
	path: string;
	Component: ReactNode;
};

export const routes: Route[] = [
	{
		path: HomePageConstants.PATH,
		Component: <HomePage />,
	},
	{
		path: EditorPageConstants.PATH,
		Component: <EditorPage />,
	},
];
