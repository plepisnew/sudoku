import React from "react";
import { Router } from "./providers/Router";
import { HeaderLayout } from "./adhoc/HeaderLayout";
import { BrowserRouter } from "react-router-dom";
import { BoardProvider } from "./contexts/BoardContext";

export const App: React.FC = () => (
  <BrowserRouter>
    <BoardProvider>
      <HeaderLayout>
        <Router />
      </HeaderLayout>
    </BoardProvider>
  </BrowserRouter>
);
