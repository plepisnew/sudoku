import { routes } from "@/infrastructure/routes";
import React from "react";
import { Route, Routes } from "react-router-dom";

export const Router: React.FC = () => (
  <Routes>
    {routes.map((route) => (
      <Route key={route.path} path={route.path} element={route.Component} />
    ))}
  </Routes>
);
