import { cn } from "@/utils/cn";
import React from "react";
import { Link } from "react-router-dom";

type NavItem = {
  path: string;
  label: string;
};

const headerNavItems: NavItem[] = [
  {
    path: "/",
    label: "Browse Sudoku",
  },
  {
    path: "/editor",
    label: "Sudoku editor",
  },
];

export const headerHeight = "80px";

export const Header: React.FC = () => {
  return (
    <header
      className={cn(
        "fixed left-0 top-0 right-0 py-5",
        "bg-zinc-100 text-black border border-b-zinc-300"
      )}
      style={{ height: headerHeight }}
    >
      <div className="container mx-auto">
        <nav>
          <ul className={cn("flex gap-5 items-center")}>
            {headerNavItems.map((navItem) => (
              <li key={navItem.label}>
                <Link
                  to={navItem.path}
                  className={cn(
                    "px-4 py-2 block",
                    "bg-zinc-500/10 rounded-xl hover:bg-zinc-500/15 transition-colors"
                  )}
                >
                  {navItem.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
