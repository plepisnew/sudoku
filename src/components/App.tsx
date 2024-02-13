import React from "react";
import { Router } from "./providers/Router";
import { HeaderLayout } from "./adhoc/HeaderLayout";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SudokuApiProvider } from "./providers/SudokuApi";

export const App: React.FC = () => (
	<BrowserRouter>
		<HeaderLayout>
			<SudokuApiProvider>
				<Router />
			</SudokuApiProvider>
		</HeaderLayout>
		<Toaster
			toastOptions={{
				position: "bottom-right",
				duration: 4000,
				style: {
					background: "none",
					padding: 0,
					margin: 0,
					maxWidth: 500,
					minWidth: 250,
				},
			}}
		/>
	</BrowserRouter>
);
