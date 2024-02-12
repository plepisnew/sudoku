import React from "react";
import { Router } from "./providers/Router";
import { HeaderLayout } from "./adhoc/HeaderLayout";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export const App: React.FC = () => (
	<BrowserRouter>
		<HeaderLayout>
			<Router />
		</HeaderLayout>
		<Toaster
			toastOptions={{
				position: "bottom-right",
				duration: 1000000,
				style: {
					background: "none",
					padding: 0,
					margin: 0,
					maxWidth: 500,
					minWidth: 250,
				},
				className: "![&>*]:m-0 ![&>*]:p-0",
			}}
		/>
	</BrowserRouter>
);
