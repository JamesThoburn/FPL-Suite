import { pageHeadings } from "@/data/navigation";
import { usePathname } from "next/navigation";

export default function PageHeading() {
    const pathname = usePathname();
    const isOverview = pathname === "/dashboard";

    return (
        <div className="mb-6.75 flex items-center justify-between gap-5 max-[700px]:mb-5.5 max-[700px]:items-start max-[700px]:gap-2.5">
            <div>
                <div className="mb-2.5 text-[8px] font-bold tracking-[1.9px] text-text-eyebrow max-[700px]:mb-2 max-[700px]:text-[7px]">
                    THE BIG PICTURE
                </div>
                <h1 className="font-(--font-manrope) text-[30px] leading-[1.35] tracking-[-1.1px] max-[1000px]:text-[27px] max-[700px]:text-2xl max-[700px]:tracking-[-.8px]">
                    {pageHeadings[pathname] ?? pageHeadings["/dashboard"]}
                </h1>
                <p className="mt-2.25 text-[11px] text-text-page-heading-p max-[700px]:mt-1.5 max-[700px]:max-w-58.75 max-[700px]:text-[10px] max-[700px]:leading-[1.6]">
                    {isOverview
                        ? "Less guesswork. More green arrows. Welcome back."
                        : "Everything you need to get ahead of the game."}
                </p>
            </div>
            {/* Might potentially add a button for users to connect their team ID here */}
        </div>
    )
}
