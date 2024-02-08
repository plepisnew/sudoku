import React, { PropsWithChildren } from "react";
import { Header, headerHeight } from "./Header";
import { cn } from "@/utils/cn";

export const HeaderLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const pagePadding = "2rem";

  return (
    <React.Fragment>
      <Header />
      <main
        className={cn("container mx-auto")}
        style={{
          paddingTop: `calc(${pagePadding} + ${headerHeight})`,
          paddingBottom: pagePadding,
        }}
      >
        {children}
      </main>
    </React.Fragment>
  );
};
