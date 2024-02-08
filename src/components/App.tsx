import React from "react";
import { Router } from "./providers/Router";
import { HeaderLayout } from "./adhoc/HeaderLayout";
import { BrowserRouter } from "react-router-dom";

export const App: React.FC = () => (
  <BrowserRouter>
    <HeaderLayout>
      <Router />
    </HeaderLayout>
  </BrowserRouter>
);
