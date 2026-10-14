import Link from "next/link"
import Icon from "@/components/ui/Icon"
import { dashboardHeroImage } from "@/lib/images"
import { formatDeadline } from "@/lib/deadline"
import type { NextGameweekResult } from "@/lib/gameweek"
import DeadlineCountdown from "./DeadlineCountdown"

type HeroProps = {
    nextGameweek: NextGameweekResult
}

function eyebrowText(result: NextGameweekResult): string {
    switch (result.status) {
        case "upcoming":
            return `${result.gameweek.name.toUpperCase()} IS ON THE HORIZON`
        case "season-ended":
            return "THE SEASON IS COMPLETE"
        case "unavailable":
            return "NEXT GAMEWEEK UNAVAILABLE"
    }
}

export default function Hero({ nextGameweek }: HeroProps) {
    return (
        <section className="relative min-h-64.5 overflow-hidden rounded-[9px] bg-surface-hero text-white max-[700px]:min-h-69 min-[1450px]:min-h-73.75">
            <img className="absolute right-0 h-full w-[66%] object-cover object-[center_51%] opacity-[.68] max-[700px]:w-[85%] max-[700px]:opacity-[.65]" src={dashboardHeroImage} alt="An aerial view of a floodlit football stadium" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-overlay-hero-solid)_0%,var(--color-overlay-hero-solid)_29%,var(--color-overlay-hero-fade)_46%,var(--color-overlay-hero-end)_100%)] max-[700px]:bg-[linear-gradient(90deg,var(--color-overlay-hero-solid)_0%,var(--color-overlay-hero-mobile-start)_35%,var(--color-overlay-hero-mobile-end)_100%)]" />
            <div className="relative px-8 py-7.25 pb-7.75 max-[1000px]:pl-6 max-[700px]:px-5.75 max-[700px]:py-6.25 min-[1450px]:px-9.5 min-[1450px]:py-8.75">
                <div className="flex items-center gap-1.75 text-[7px] font-semibold tracking-[1.8px] text-text-hero-eyebrow max-[700px]:text-[6px] max-[700px]:tracking-[1.3px] min-[1450px]:text-[9px]">
                    <span className="h-1.25 w-1.25 rounded-full bg-surface-live-dot" /> {eyebrowText(nextGameweek)}
                </div>
                <h2 className="mt-4.25 font-(--font-manrope) text-[33px] leading-tight tracking-[-1px] max-[1000px]:text-[30px] max-[700px]:mt-4.5 max-[700px]:text-[30px] min-[1450px]:text-[40px]">
                    A new week.
                    <br />A new opportunity.
                </h2>
                <p className="mt-3 text-[10px] text-text-hero-p max-[700px]:max-w-42.5 max-[700px]:text-[9px] max-[700px]:leading-[1.7] min-[1450px]:text-xs">The next green arrow starts with a good plan.</p>
                <Link className="w-fit mt-5.75 flex items-center gap-7 rounded-sm bg-surface-light-button px-3.75 py-2.75 text-[10px] font-semibold text-text-light-button hover:bg-surface-light-button-hover max-[700px]:mt-5.25 max-[700px]:gap-3.75 max-[700px]:px-3 max-[700px]:py-2.5 max-[700px]:text-[9px] min-[1450px]:text-xs" href="/dashboard/transfers">
                    Plan your gameweek <Icon name="arrow" size={18} />
                </Link>
            </div>
            <div className="absolute bottom-8.25 right-8.25 w-52.5 rounded-md border border-border-on-dark bg-surface-deadline px-4.5 py-4.25 backdrop-blur-[10px] max-[1000px]:right-5.5 max-[1000px]:w-44 max-[1000px]:p-3.5 max-[700px]:bottom-6 max-[700px]:right-3.75 max-[700px]:w-33.5 max-[700px]:p-3">
                <span className="text-[7px] tracking-[1.5px] text-text-deadline-span max-[700px]:text-[6px] max-[700px]:tracking-[1px]">NEXT DEADLINE</span>
                {nextGameweek.status === "upcoming" ? (
                    <>
                        <strong className="mb-4 mt-1.75 block text-xs font-medium max-[1000px]:text-[11px] max-[700px]:mb-3 max-[700px]:mt-1.5 max-[700px]:text-[9px]">
                            {formatDeadline(nextGameweek.gameweek.deadlineTime).date}
                            <span className="mx-1.25 opacity-50 max-[700px]:mx-0.5">·</span>
                            {formatDeadline(nextGameweek.gameweek.deadlineTime).time}
                        </strong>
                        <DeadlineCountdown deadlineTime={nextGameweek.gameweek.deadlineTime} />
                    </>
                ) : (
                    <strong className="mt-1.75 block text-xs font-medium max-[1000px]:text-[11px] max-[700px]:mt-1.5 max-[700px]:text-[9px]">
                        {nextGameweek.status === "season-ended" ? "Season complete" : "Unavailable right now"}
                    </strong>
                )}
            </div>
            <span className="absolute right-8.5 top-7.5 text-[6px] tracking-[2px] text-text-hero-caption max-[700px]:hidden">EVERY POINT COUNTS.</span>
        </section>
    )
}