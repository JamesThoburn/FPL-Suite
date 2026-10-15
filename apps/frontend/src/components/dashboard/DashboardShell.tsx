"use client";

import { useEffect, useState, type ReactNode } from "react";
import DashboardFooter from "./DashboardFooter";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageHeading from "./PageHeading";

type DashboardShellProps = {
    children: ReactNode;
    seasonLabel: string | null;
}

export default function DashboardShell({
    children,
    seasonLabel
}: DashboardShellProps) {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    useEffect(() => {
        if (!isMobileNavOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsMobileNavOpen(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMobileNavOpen]);

    function closeMobileNav() {
        setIsMobileNavOpen(false);
    }

    return (
        <div className="flex min-h-screen">
            <button
                type="button"
                aria-label="Close navigation menu"
                tabIndex={isMobileNavOpen ? 0 : -1}
                className={`fixed inset-0 z-10 hidden bg-black/40 max-[700px]:block ${isMobileNavOpen
                        ? "max-[700px]:opacity-100"
                        : "pointer-events-none max-[700px]:opacity-0"
                    }`}
                onClick={closeMobileNav}
            />

            <Sidebar
                isMobileNavOpen={isMobileNavOpen}
                onClose={closeMobileNav}
            />

            <div className="ml-58 w-[calc(100%-232px)] max-[1200px]:ml-51.75 max-[1200px]:w-[calc(100%-207px)] max-[1000px]:ml-46.25 max-[1000px]:w-[calc(100%-185px)] max-[700px]:ml-0 max-[700px]:w-full">
                <Topbar
                    isMobileNavOpen={isMobileNavOpen}
                    onToggleMobileNav={() =>
                        setIsMobileNavOpen((open) => !open)
                    }
                    seasonLabel={seasonLabel}
                />

                <main className="mx-auto max-w-360 px-10 pt-8.5 max-[1200px]:px-7 max-[1000px]:px-5.5 max-[700px]:px-4.75 max-[700px]:pt-6.25 min-[1450px]:pt-10.75">
                    <PageHeading />
                    {children}
                    <DashboardFooter />
                </main>
            </div>
        </div>
    );
}