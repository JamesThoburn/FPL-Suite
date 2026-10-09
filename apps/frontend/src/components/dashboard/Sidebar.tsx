import Link from "next/link";
import Brand from "../ui/Brand";
import Icon from "../ui/Icon";
import { dashboardNav } from "@/data/navigation";
import { usePathname } from "next/navigation";

type SidebarProps = {
    isMobileNavOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({
    isMobileNavOpen,
    onClose
}: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            id="dashboard-sidebar"
            className={`fixed inset-y-0 left-0 z-20 flex w-58 flex-col border-r border-border-default bg-surface-shell px-4.75 pt-8.75 max-[1200px]:w-51.75 max-[1200px]:px-3.5 max-[1000px]:w-46.25 max-[1000px]:px-2.5 max-[700px]:w-58 max-[700px]:shadow-[15px_0_40px_var(--color-shadow-sidebar)] ${isMobileNavOpen
                ? "max-[700px]:visible max-[700px]:translate-x-0 max-[700px]:transition-[transform_200ms_ease,visibility_0s]"
                : "max-[700px]:invisible max-[700px]:-translate-x-full max-[700px]:transition-[transform_200ms_ease,visibility_0s_linear_200ms]"
                }`}
            onClickCapture={(event) => {
                if (
                    event.target instanceof Element &&
                    event.target.closest("a")
                ) {
                    onClose();
                }
            }}
        >
            <Brand variant="workspace" href="/dashboard" />
            <div className="mb-11 ml-3.25 mt-3.5 text-[8px] font-[650] tracking-[1.5px] text-text-workspace-label max-[1000px]:text-[6px] max-[1000px]:tracking-[1.4px]">YOUR FPL, A LITTLE SMARTER.</div>
            <nav aria-label="Main navigation">
                {dashboardNav.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`mb-1.75 flex w-full items-center gap-3.25 whitespace-nowrap rounded-md px-3.5 py-3.25 text-left text-xs font-medium transition-colors max-[1200px]:gap-2.5 max-[1200px]:text-[11px] max-[1000px]:gap-2.5 max-[1000px]:px-2.5 max-[1000px]:py-3 max-[1000px]:text-[10px]
                            ${isActive
                                    ? "bg-surface-navigation-active font-bold text-text-navigation-active [&_svg]:stroke-2"
                                    : "bg-transparent text-text-nav-item hover:bg-surface-nav-item-hover hover:text-brand"
                                }`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            <Icon name={item.icon} />
                            <span>{item.label}</span>
                            {item.isNew && <span className="ml-auto rounded-[3px] bg-surface-new-tag px-1.25 py-0.75 text-[7px] tracking-[.5px] text-text-new-tag max-[1200px]:text-[6px]">NEW</span>}
                        </Link>
                    )
                })}
            </nav>
            <div className="mt-auto pt-12.5">
                <div className="mx-1 mb-5.75 rounded-lg bg-surface-upgrade-card px-4 py-4.5 max-[1000px]:px-3 max-[1000px]:py-3.5">
                    <span className="text-text-upgrade-icon">
                        <Icon name="spark" />
                    </span>
                    <h3 className="mb-1.75 mt-2.5 text-[13px] font-bold max-[1000px]:text-[11px]">Ahead of the game.</h3>
                    <p className="text-[10px] leading-[1.8] text-text-upgrade-card-p max-[1000px]:text-[9px]">
                        More insights. Better decisions.
                        <br />
                        Meet your unfair advantage.
                    </p>
                    <button className="mt-4 flex w-full items-center justify-between bg-transparent p-0 text-[10px] font-bold text-text-upgrade-card-button">
                        Explore Suite Pro <Icon name="arrow" size={16} />
                    </button>
                </div>
                <button className="mb-1.75 flex w-full items-center gap-3.25 whitespace-nowrap rounded-md bg-transparent px-3.5 py-2.5 text-left text-[11px] font-medium text-text-nav-item hover:bg-surface-nav-item-hover hover:text-brand max-[1200px]:gap-2.5 max-[1200px]:px-3.5 max-[1000px]:gap-2.5 max-[1000px]:px-2.5">
                    <Icon name="settings" />
                    Settings
                </button>
                <button className="mb-1.75 flex w-full items-center gap-3.25 whitespace-nowrap rounded-md bg-transparent px-3.5 py-2.5 text-left text-[11px] font-medium text-text-nav-item hover:bg-surface-nav-item-hover hover:text-brand max-[1200px]:gap-2.5 max-[1200px]:px-3.5 max-[1000px]:gap-2.5 max-[1000px]:px-2.5">
                    <Icon name="help" />
                    Help & feedback
                </button>
                <button className="-mx-4.75 mt-6 flex w-[calc(100%+38px)] items-center gap-2.5 border-t border-border-default bg-transparent px-5.25 py-5.25 text-left [&>svg]:ml-auto [&>svg]:text-text-profile-svg max-[1200px]:-mx-3.5 max-[1200px]:w-[calc(100%+28px)] max-[1200px]:px-4.25 max-[1000px]:-mx-2.5 max-[1000px]:w-[calc(100%+20px)] max-[1000px]:px-3 max-[1000px]:py-4.5">
                    <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-surface-avatar text-[11px] font-semibold text-text-avatar max-[1000px]:h-7.25 max-[1000px]:w-7.25">JD</span>
                    <span>
                        <strong className="block text-[11px] font-semibold max-[1000px]:text-[10px]">Jamie Davies</strong>
                        <small className="mt-1 block text-[9px] text-text-profile-small max-[1000px]:text-[8px]">Weekend Wanderers</small>
                    </span>
                    <Icon name="chevron" size={16} />
                </button>
            </div>
        </aside>
    )
}
