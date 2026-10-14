const LONDON = "Europe/London"

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON,
    weekday: "short",
    day: "numeric",
    month: "short",
})

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
})

export function formatDeadline(iso: string): { date: string; time: string } {
    const d = new Date(iso)
    const part = (type: Intl.DateTimeFormatPartTypes) =>
        dateFormatter.formatToParts(d).find((p) => p.type === type)?.value ?? ""

    return {
        date: `${part("weekday")}, ${part("day")} ${part("month")}`,
        time: timeFormatter.format(d),
    }
}