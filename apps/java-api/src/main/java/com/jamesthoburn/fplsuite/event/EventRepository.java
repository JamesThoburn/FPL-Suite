package com.jamesthoburn.fplsuite.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    interface NextEventView {
        Integer getId();
        String getName();
        Instant getDeadlineTime();
    }

    interface SeasonEndView {
        Integer getId();
        Boolean getCurrent();
        Boolean getFinished();
    }

    @Query(value = """
        SELECT
                EXTRACT (
                        YEAR FROM (MIN(deadline_time) AT TIME ZONE 'UTC')
                        )::integer AS "startYear",
                EXTRACT (
                        YEAR FROM (MAX(deadline_time) AT TIME ZONE 'UTC')
                        )::integer AS "endYear"
        FROM events
        WHERE deadline_time IS NOT NULL
        """, nativeQuery = true)
    SeasonYearProjection findSeasonYears();

    Optional<NextEventView> findFirstByNextTrueOrderByDeadlineTimeAsc();

    Optional<SeasonEndView> findTopByOrderByIdDesc();
}
