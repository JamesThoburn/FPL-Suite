package com.jamesthoburn.fplsuite.fixture;

import java.time.Instant;
import java.util.List;

public record FixturesResponse(
        Integer defaultGameweekId,
        List<Gameweek> gameweeks,
        List<Fixture> fixtures
) {
    public record Gameweek(
            Integer id,
            String name,
            boolean finished,
            boolean current,
            boolean next,
            Instant firstKickoffTime,
            Instant lastKickoffTime
    ) {}

    public record Team(
            Integer id,
            String name,
            String shortName,
            Integer code
    ) {}

    public record Fixture(
            Integer id,
            Integer code,
            Integer eventId,
            boolean finished,
            boolean finishedProvisional,
            Instant kickoffTime,
            Integer minutes,
            boolean provisionalStartTime,
            boolean started,
            Integer homeScore,
            Integer awayScore,
            Integer homeDifficulty,
            Integer awayDifficulty,
            Team homeTeam,
            Team awayTeam
    ) {}
}