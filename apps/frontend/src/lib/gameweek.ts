export type NextGameweek = {
    id: number
    name: string
    deadlineTime: string // ISO-8601 instant
}

export type NextGameweekResult =
    | { status: "upcoming"; gameweek: NextGameweek }
    | { status: "season-ended" }
    | { status: "unavailable" }

function isNextGameweek(value: unknown): value is NextGameweek {
    if (typeof value !== "object" || value === null) return false
    const v = value as Record<string, unknown>
    return (
        typeof v.id === "number" &&
        typeof v.name === "string" &&
        typeof v.deadlineTime === "string" &&
        !Number.isNaN(Date.parse(v.deadlineTime))
    )
}

export async function getNextGameweek(): Promise<NextGameweekResult> {
    const baseUrl = process.env.JAVA_API_BASE_URL
    if (!baseUrl) {
        console.error("JAVA_API_BASE_URL is not set")
        return { status: "unavailable" }
    }

    try {
        const res = await fetch(`${baseUrl}/api/v1/season/gameweek/next`, {
            next: { revalidate: 60 },
            signal: AbortSignal.timeout(5000),
        })

        // 204 has no body: check status before attempting res.json()
        if (res.status === 204) return { status: "season-ended" }

        if (!res.ok) {
            console.error(`Next gameweek request failed with status ${res.status}`)
            return { status: "unavailable" }
        }

        const body: unknown = await res.json()
        if (!isNextGameweek(body)) {
            console.error("Next gameweek response failed validation", body)
            return { status: "unavailable" }
        }

        return { status: "upcoming", gameweek: body }
    } catch (error) {
        console.error("Next gameweek request threw", error)
        return { status: "unavailable" }
    }
}