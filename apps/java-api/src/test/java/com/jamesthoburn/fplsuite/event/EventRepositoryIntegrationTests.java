package com.jamesthoburn.fplsuite.event;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest(properties = {
        "spring.jpa.hibernate.ddl-auto=none",
        "spring.sql.init.mode=never"
})
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@Testcontainers
public class EventRepositoryIntegrationTests {
    @Container
    private static final PostgreSQLContainer POSTGRES =
            new PostgreSQLContainer("postgres:17-alpine")
                    .withDatabaseName("fpl_suite_test")
                    .withUsername("test")
                    .withPassword("test");

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @DynamicPropertySource
    static void configureDatabase(DynamicPropertyRegistry properties) {
        properties.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        properties.add("spring.datasource.username", POSTGRES::getUsername);
        properties.add("spring.datasource.password", POSTGRES::getPassword);
        properties.add(
                "spring.datasource.driver-class-name",
                POSTGRES::getDriverClassName
        );
    }

    @Test
    void returnsEarliestAndLatestDeadlineYearsInUtc() {
        insertEvent(1, "Gameweek 1", "2026-08-21T17:30:00Z");
        insertEvent(38, "Gameweek 38", "2027-08-23T15:00:00Z");

        SeasonYearProjection years = eventRepository.findSeasonYears();

        assertNotNull(years);
        assertEquals(2026, years.getStartYear());
        assertEquals(2027, years.getEndYear());
    }

    @Test
    void returnsNullYearsWhenNoDeadlinesExist() {
        insertEvent(1, "Gameweek without deadline", null);

        SeasonYearProjection years = eventRepository.findSeasonYears();

        assertNotNull(years);
        assertNull(years.getStartYear());
        assertNull(years.getEndYear());
    }

    // Template for an insertion event - Easily reusable
    private void insertEvent(Integer id, String name, String deadlineTime) {
        jdbcTemplate.update(
                """
                INSERT INTO events (id, name, deadline_time, payload)
                VALUES (?, ?, CAST(? AS timestamptz), CAST(? AS jsonb))
                """,
                id,
                name,
                deadlineTime,
                "{}"
        );
    }
}
