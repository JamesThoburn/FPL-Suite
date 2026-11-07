export type FixtureGameweek = {
    id: number;
    name: string;
    finished: boolean;
    current: boolean;
    next: boolean;
    firstKickoffTime: string | null;
    lastKickoffTime: string | null;
}

export type FixtureTeam = {
    id: number;
    name: string;
    shortName: string;
    code: number;
}

export type Fixture = {
    id: number;
    code: number;
    eventId: number | null;
    finished: boolean;
    finishedProvisional: boolean;
    kickoffTime: string | null;
    minutes: number;
    provisionalStartTime: boolean;
    started: boolean;
    homeScore: number | null;
    awayScore: number | null;
    homeDifficulty: number;
    awayDifficulty: number;
    homeTeam: FixtureTeam;
    awayTeam: FixtureTeam;
}

export type FixturesData = {
    defaultGameweekId: number;
    gameweeks: FixtureGameweek[];
    fixtures: Fixture[];
}

export type FixturesResult = 
    | { status: "ready"; data: FixturesData }
    | { status: "unavailable" }

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isPositiveInteger(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
}

function isNullableInteger(value: unknown): value is number | null {
  return value === null || Number.isInteger(value)
}

function isNullableInstant(value: unknown): value is string | null {
  return (
    value === null ||
    (typeof value === "string" && !Number.isNaN(Date.parse(value)))
  )
}

function isGameweek(value: unknown): value is FixtureGameweek {
    if (!isRecord(value)) return false;

    return (
        isPositiveInteger(value.id) &&
        typeof value.name === "string" &&
        typeof value.finished === "boolean" &&
        typeof value.current === "boolean" &&
        typeof value.next === "boolean" &&
        isNullableInstant(value.firstKickoffTime) &&
        isNullableInstant(value.lastKickoffTime)
    )
}

function isTeam(value: unknown): value is FixtureTeam {
  if (!isRecord(value)) return false

  return (
    isPositiveInteger(value.id) &&
    isPositiveInteger(value.code) &&
    typeof value.name === "string" &&
    typeof value.shortName === "string"
  )
}

function isFixture(value: unknown): value is Fixture {
  if (!isRecord(value)) return false

  return (
    isPositiveInteger(value.id) &&
    isPositiveInteger(value.code) &&
    (value.eventId === null || isPositiveInteger(value.eventId)) &&
    typeof value.finished === "boolean" &&
    typeof value.finishedProvisional === "boolean" &&
    isNullableInstant(value.kickoffTime) &&
    isNonNegativeInteger(value.minutes) &&
    typeof value.provisionalStartTime === "boolean" &&
    typeof value.started === "boolean" &&
    isNullableInteger(value.homeScore) &&
    isNullableInteger(value.awayScore) &&
    isPositiveInteger(value.homeDifficulty) &&
    isPositiveInteger(value.awayDifficulty) &&
    isTeam(value.homeTeam) &&
    isTeam(value.awayTeam)
  )
}

function isFixturesData(value: unknown): value is FixturesData {
    if (!isRecord(value)) return false;

    return (
        isPositiveInteger(value.defaultGameweekId) &&
        Array.isArray(value.gameweeks) &&
        value.gameweeks.every(isGameweek) &&
        value.gameweeks.some(
            (gameweek) =>
                isRecord(gameweek) && gameweek.id === value.defaultGameweekId
        ) &&
        Array.isArray(value.fixtures) &&
        value.fixtures.every(isFixture)
    )
}

export async function getFixtures(): Promise<FixturesResult> {
    const baseUrl = process.env.JAVA_API_BASE_URL;

    if (!baseUrl) {
        console.error("JAVA_API_BASE_URL is not set");
        return { status: "unavailable" };
    }

    try {
        const res = await fetch(
            `${baseUrl.replace(/\/+$/, "")}/api/v1/fixtures`,
            {
                next: { revalidate: 10 },
                signal: AbortSignal.timeout(5000),
            }
        )

        if (!res.ok) {
            console.error(`Fixtures request failed with status ${res.status}`);
            return { status: "unavailable" };
        }

        const body: unknown = await res.json();

        if (!isFixturesData(body)) {
            console.error("Fixtures request failed validation", body);
            return { status: "unavailable" };
        }

        return { status: "ready", data: body };
    } catch (error) {
        console.error("Fixtures request threw", error)
        return { status: "unavailable" };
    }
}