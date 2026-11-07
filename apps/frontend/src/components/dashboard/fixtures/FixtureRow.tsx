import TeamCrest from "@/components/ui/TeamCrest";
import { Fixture } from "@/lib/fixtures";

const londonTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h12"
})

function formatFixtureStatus(fixture: Fixture): string {
  if (fixture.finishedProvisional) return "FT"
  if (fixture.started) return "Live"
  if (!fixture.kickoffTime) return "Kickoff TBC"
  return londonTimeFormatter.format(new Date(fixture.kickoffTime))
}

function formatScoreStatus(fixture: Fixture): string | null {
  if (fixture.finishedProvisional) return "FT"
  if (fixture.started) return `${fixture.minutes}′`
  return null
}

export default function FixtureRow({ fixture, wide = false }: { fixture: Fixture; wide?: boolean }) {
    const hasScore = fixture.homeScore !== null && fixture.awayScore !== null;
    const scoreStatus = hasScore ? formatScoreStatus(fixture) : null;

    return (
        <div className={`grid ${wide ? "grid-cols-[1fr_90px_1fr] px-10 py-5.75 max-[700px]:grid-cols-[1fr_55px_1fr] max-[700px]:px-4.25 max-[700px]:py-5 [&>div]:text-sm max-[700px]:[&>div]:text-[10px] [&>.fixture-time]:text-[11px] max-[700px]:[&>.fixture-time]:text-[8px]" : "grid-cols-[1fr_50px_1fr] px-5 py-3.75 max-[1200px]:px-3.5 max-[1000px]:py-3.25 max-[700px]:px-5 max-[700px]:py-4 [&>div]:text-[9px] max-[1200px]:[&>div]:text-[8px] max-[700px]:[&>div]:text-[10px] min-[1450px]:[&>div]:text-[11px]"} items-center gap-1 border-b border-border-fixture-row`}>
            <div className={`flex items-center whitespace-nowrap text-text-fixture-row-div ${wide ? "gap-2 max-[700px]:gap-2" : "gap-2 max-[1200px]:gap-1.25 max-[700px]:gap-2"}`}>
                <TeamCrest code={fixture.homeTeam.code} />
                <span>{fixture.homeTeam.name}</span>
            </div>
            {hasScore ? (
                <div className={`fixture-time flex flex-col items-center whitespace-nowrap rounded-[3px] bg-surface-fixture-time px-0.5 py-1 text-center text-text-fixture-time ${wide ? "text-[11px] max-[700px]:text-[8px]" : "text-[7px] max-[700px]:text-[8px] min-[1450px]:text-[8px]"}`}>
                    <span>{fixture.homeScore} – {fixture.awayScore}</span>
                    {scoreStatus && (
                        <span className="text-[0.8em] leading-tight opacity-75">
                            {scoreStatus}
                        </span>
                    )}
                </div>
            ) : (
                <span className={`fixture-time uppercase whitespace-nowrap rounded-[3px] bg-surface-fixture-time px-0.5 py-1 text-center text-text-fixture-time ${wide ? "text-[11px] max-[700px]:text-[8px]" : "text-[7px] max-[700px]:text-[8px] min-[1450px]:text-[8px]"}`}>
                    {formatFixtureStatus(fixture)}
                </span>
            )}
            <div className={`flex items-center justify-end whitespace-nowrap text-text-fixture-row-div ${wide ? "gap-2" : "gap-2 max-[1200px]:gap-1.25"} ${wide ? "text-sm max-[700px]:text-[10px]" : "text-[9px] max-[1200px]:text-[8px] max-[700px]:text-[10px] min-[1450px]:text-[11px]"}`}>
                <span>{fixture.awayTeam.name}</span>
                <TeamCrest code={fixture.awayTeam.code} />
            </div>
        </div>
    )
}
