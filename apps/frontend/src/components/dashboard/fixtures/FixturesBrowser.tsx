"use client";

import { FixturesResult } from "@/lib/fixtures";
import { useState } from "react";
import FixtureRow from "./FixtureRow";

const fixtureDayFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "long",
    day: "numeric",
    month: "long",
});
const fixtureDayKeyFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

function getFixtureDay(kickoffTime: string) {
    const kickoff = new Date(kickoffTime);
    const keyParts = fixtureDayKeyFormatter.formatToParts(kickoff);
    const keyPart = (type: Intl.DateTimeFormatPartTypes) =>
        keyParts.find((item) => item.type === type)?.value ?? "";

    return {
        key: `${keyPart("year")}-${keyPart("month")}-${keyPart("day")}`,
        label: fixtureDayFormatter.format(kickoff).toLocaleUpperCase("en-GB"),
    };
}

const londonDateFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "long",
    year: "numeric",
});

function getDateParts(iso: string) {
    const parts = londonDateFormatter.formatToParts(new Date(iso));
    const part = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((item) => item.type === type)?.value ?? "";

    return {
        day: part("day"),
        month: part("month"),
        year: part("year"),
    };
}

function formatGameweekDateRange(start: string | null, end: string | null) {
    if (!start || !end) return "Dates TBC";

    const first = getDateParts(start);
    const last = getDateParts(end);

    if (first.day === last.day && first.month === last.month && first.year === last.year) {
        return `${first.day} ${first.month}`;
    }

    if (first.year === last.year && first.month === last.month) {
        return `${first.day}–${last.day} ${last.month}`;
    }

    if (first.year === last.year) {
        return `${first.day} ${first.month}–${last.day} ${last.month}`;
    }

    return `${first.day} ${first.month} ${first.year}–${last.day} ${last.month} ${last.year}`;
}

export default function FixturesBrowser({ result }: { result: FixturesResult }) {
    if (result.status === "unavailable") {
        return (
            <section
                className="rounded-2xl border border-black/5 bg-surface-card p-6 text-sm text-text-muted"
            >
                Fixtures are temporarily unavailable. Please try again later.
            </section>
        )
    }

    const { data } = result;
    const [selectedGameweekId, setSelectedGameweekId] = useState(data.defaultGameweekId);
    const selectedIndex = data.gameweeks.findIndex((gameweek) => gameweek.id === selectedGameweekId);
    const selectedGameweek = data.gameweeks[selectedIndex];

    if (!selectedGameweek) {
        return (
            <section
                className="rounded-2xl border border-black/5 bg-surface-card p-6 text-sm text-text-muted"
                role="status"
            >
                Gameweek information is not available
            </section>
        )
    }

    const gameweekFixtures = data.fixtures
        .filter((fixture) => fixture.eventId === selectedGameweekId)
        .sort((a, b) => {
            if (!a.kickoffTime) return b.kickoffTime ? 1 : a.id - b.id;
            if (!b.kickoffTime) return -1;
            return (
                Date.parse(a.kickoffTime) - Date.parse(b.kickoffTime) || a.id - b.id
            )
        })

    const fixturesByDay = new Map<string, { label: string; fixtures: typeof gameweekFixtures }>();
    for (const fixture of gameweekFixtures) {
        const day = fixture.kickoffTime
            ? getFixtureDay(fixture.kickoffTime)
            : { key: "tbc", label: "DATE TBC" };
        const group = fixturesByDay.get(day.key);

        if (group) {
            group.fixtures.push(fixture);
        } else {
            fixturesByDay.set(day.key, { label: day.label, fixtures: [fixture] });
        }
    }

    const previousGameweek = data.gameweeks[selectedIndex - 1];
    const nextGameweek = data.gameweeks[selectedIndex + 1];

    return (
        <section className="overflow-hidden rounded-lg border border-border-default bg-surface-card">
            <div className="flex items-center justify-between gap-3 px-5.5 pb-4.5 pt-5.5 max-[1200px]:px-4.25 max-[700px]:px-4.25 max-[700px]:pb-4.25 max-[700px]:pt-5">
                <h2 className="text-[15px] font-bold tracking-[-.35px] max-[700px]:text-sm min-[1450px]:text-[17px]">
                    Gameweek {selectedGameweek.id}
                </h2>
                <div className="flex items-center gap-3.75 text-[8px] text-text-week-selector max-[700px]:gap-2.75">
                    <button
                        className="bg-transparent p-0 text-[19px] leading-none text-text-week-selector-button"
                        aria-label="Previous gameweek"
                        disabled={!previousGameweek}
                        onClick={() => {
                            if (previousGameweek) {
                                setSelectedGameweekId(previousGameweek.id);
                            }
                        }}
                    >
                        ‹
                    </button>

                    <span className="text-[11px]">
                        {formatGameweekDateRange(selectedGameweek.firstKickoffTime, selectedGameweek.lastKickoffTime)}
                    </span>

                    <button
                        className="bg-transparent p-0 text-[19px] leading-none text-text-week-selector-button"
                        aria-label="Next gameweek"
                        disabled={!nextGameweek}
                        onClick={() => {
                            if (nextGameweek) {
                                setSelectedGameweekId(nextGameweek.id);
                            }
                        }}
                    >
                        ›
                    </button>
                </div>
            </div>
            {[...fixturesByDay.entries()].map(([dayKey, group]) => (
                <div key={dayKey}>
                    <div className="bg-surface-fixture-date px-5.25 py-2.25 text-[7px] font-semibold tracking-[1.2px] text-text-fixture-date">
                        {group.label}
                    </div>
                    {group.fixtures.map((fixture) => (
                        <FixtureRow key={fixture.id} fixture={fixture} wide />
                    ))}
                </div>
            ))}
        </section>
    )
}