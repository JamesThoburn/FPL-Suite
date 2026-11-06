package com.jamesthoburn.fplsuite.fixture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface FixtureRepository extends JpaRepository<Fixture, Integer> {
    interface FixtureView {
        Integer getId();
        Integer getCode();
        Integer getEventId();
        Boolean getFinished();
        Boolean getFinishedProvisional();
        Instant getKickoffTime();
        Integer getMinutes();
        Boolean getProvisionalStartTime();
        Boolean getStarted();
        Integer getHomeScore();
        Integer getAwayScore();
        Integer getHomeDifficulty();
        Integer getAwayDifficulty();
        Integer getHomeTeamId();
        String getHomeTeamName();
        String getHomeTeamShortName();
        Integer getAwayTeamId();
        String getAwayTeamName();
        String getAwayTeamShortName();
        Integer getHomeTeamCode();
        Integer getAwayTeamCode();
    }

    @Query("""
        SELECT
            f.id AS id,
            f.code AS code,
            e.id AS eventId,
            f.finished AS finished,
            f.finishedProvisional AS finishedProvisional,
            f.kickoffTime AS kickoffTime,
            f.minutes AS minutes,
            f.provisionalStartTime AS provisionalStartTime,
            f.started AS started,
            f.homeScore AS homeScore,
            f.awayScore AS awayScore,
            f.homeDifficulty AS homeDifficulty,
            f.awayDifficulty AS awayDifficulty,
            homeTeam.id AS homeTeamId,
            homeTeam.name AS homeTeamName,
            homeTeam.shortName AS homeTeamShortName,
            awayTeam.id AS awayTeamId,
            awayTeam.name AS awayTeamName,
            awayTeam.shortName AS awayTeamShortName,
            homeTeam.code AS homeTeamCode,
            awayTeam.code AS awayTeamCode
        FROM Fixture f
        LEFT JOIN f.event e
        JOIN f.homeTeam homeTeam
        JOIN f.awayTeam awayTeam
        ORDER BY f.kickoffTime ASC, f.id ASC
        """)
    List<FixtureView> findAllFixtureViews();
}
