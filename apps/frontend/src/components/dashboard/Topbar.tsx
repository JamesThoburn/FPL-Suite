"use client";

import { usePathname } from "next/navigation";
import Icon from "../ui/Icon";
import { getActiveNav } from "@/data/navigation";

type TopbarProps = {
    isMobileNavOpen: boolean;
    onToggleMobileNav: () => void;
};

export default function Topbar({
    isMobileNavOpen,
    onToggleMobileNav
}: TopbarProps) {
    const pathname = usePathname();
    const active = getActiveNav(pathname);

    return (
        <header className="flex h-18.5 items-center justify-between border-b border-border-default bg-surface-shell px-10 max-[1200px]:px-7 max-[1000px]:px-5.5 max-[700px]:h-15.25 max-[700px]:px-5">
            <div className="flex items-center gap-3.25 text-[10px] text-text-breadcrumb max-[700px]:gap-2.25 max-[700px]:text-[9px]">
                <button
                    className="hidden bg-transparent p-0 text-text-mobile-toggle max-[700px]:flex"
                    aria-label={
                        isMobileNavOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    type="button"
                    aria-expanded={isMobileNavOpen}
                    aria-controls="dashboard-sidebar"
                    onClick={onToggleMobileNav}
                >
                    <Icon name="menu" />
                </button>
                <span>Your workspace</span>
                <Icon name="chevron" size={13} />
                <strong className="font-medium text-text-breadcrumb-strong">{active.label}</strong>
            </div>
            <div className="flex items-center gap-5.75 max-[700px]:gap-3.75">
                {/* Will need fetched somehow */}
                <span className="text-[8px] font-semibold tracking-[1.6px] text-text-season-label max-[700px]:hidden">2024 / 25 SEASON</span>
            </div>
        </header>
    )
}