import Link from "next/link";
import Icon, { IconName } from "../ui/Icon";

const TOOLS: { title: string; text: string; icon: IconName; href: string }[] = [
    {
        title: "Transfer planner",
        text: "Think three moves ahead, not just one.",
        icon: "transfer",
        href: "/dashboard/transfers",
    },
    {
        title: "Player explorer",
        text: "Find the numbers behind the next big pick.",
        icon: "chart",
        href: "/dashboard/players",
    },
    {
        title: "Mini leagues",
        text: "Keep your friends close. Your rivals closer.",
        icon: "trophy",
        href: "/dashboard/leagues",
    },
]

export default function ToolsSection() {
    return (
        <section className="mt-7 max-[700px]:mt-6.25">
            <div className="mb-3.75 flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-bold tracking-[-.35px] max-[700px]:text-sm min-[1450px]:text-[17px]">
                    A little more in your corner.
                </h2>
                <span className="text-[7px] tracking-[1.4px] text-text-section-title-span max-[700px]:text-right max-[700px]:text-[5px] max-[700px]:tracking-[1px]">
                    THE TOOLS TO GET AHEAD
                </span>
            </div>
            <div className="grid grid-cols-3 gap-[15px] max-[1000px]:gap-[9px] max-[700px]:grid-cols-1">
                {TOOLS.map((tool) => (
                    <Link
                        className="flex items-center gap-3 rounded-md border border-border-default bg-surface-card px-4 py-4.25 text-left transition-all hover:bg-surface-tool-card-hover hover:shadow-[0_3px_12px_var(--color-shadow-tool-card-hover)] max-[1000px]:relative max-[1000px]:flex-wrap max-[1000px]:gap-2.75 max-[1000px]:px-3 max-[1000px]:py-3.5 max-[700px]:flex-nowrap max-[700px]:gap-3.5 max-[700px]:p-4.25 min-[1450px]:p-5.5"
                        key={tool.title}
                        href={tool.href}
                    >
                        <span className="flex h-9.25 w-9.25 shrink-0 items-center justify-center rounded-[5px] bg-surface-tool-icon text-text-tool-icon max-[1000px]:h-8.5 max-[1000px]:w-7.5 max-[700px]:h-9.5 max-[700px]:w-9.5">
                            <Icon name={tool.icon} size={23} />
                        </span>
                        <div className="max-[1000px]:w-full max-[700px]:w-auto">
                            <h3 className="mb-1.25 text-[10px] font-[650] text-text-tool-card-h3 max-[1000px]:text-[9px] max-[700px]:text-[11px] min-[1450px]:text-xs">
                                {tool.title}
                            </h3>
                            <p className="text-[8px] leading-normal text-text-tool-card-p max-[1000px]:text-[7px] max-[700px]:text-[9px] min-[1450px]:text-[10px]">
                                {tool.text}
                            </p>
                        </div>
                        <span className="ml-auto text-text-tool-card-svg max-[1000px]:absolute max-[1000px]:right-3.5 max-[1000px]:top-5.25 max-[700px]:static"><Icon name="arrow" size={19} /></span>
                    </Link>
                ))}
            </div>
        </section >
    )
}