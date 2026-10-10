package com.jamesthoburn.fplsuite.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
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
}
