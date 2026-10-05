"use client";

import { useEffect, type ReactNode } from "react";

type ThemeProviderProps = {
    children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
    useEffect(() => {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
        const applySystemTheme = () => {
            document.documentElement.dataset.theme = systemTheme.matches
                ? "dark"
                : "light";
        };

        applySystemTheme();
        systemTheme.addEventListener("change", applySystemTheme);

        return () => systemTheme.removeEventListener("change", applySystemTheme);
    }, []);

    return children;
}