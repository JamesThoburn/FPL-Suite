package com.jamesthoburn.fplsuite.fixture;

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

import java.sql.Types;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest(properties = {
        "spring.jpa.hibernate.ddl-auto=none",
        "spring.sql.init.mode=never"
})
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@Testcontainers
class FixtureRepositoryIntegrationTests {
    @Container
    private static final PostgreSQLContainer POSTGRES =
            new PostgreSQLContainer("postgres:17-alpine")
                    .withDatabaseName("fpl_suite_test")
                    .withUsername("test")
                    .withPassword("test");

    @Autowired
    private FixtureRepository fixtureRepository;

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
    void findsAssignedAndUnassignedFixturesWithTeamDetails() {
        insertTeam(1, "Home Team", "HOM");
        insertTeam(2, "Away Team", "AWY");
        insertEvent(1, "Gameweek 1");

        Instant kickoff = Instant.parse("2026-08-21T19:00:00Z");
        insertFixture(100, 1, kickoff);
        insertFixture(101, null, null);

        List<FixtureRepository.FixtureView> fixtures =
                fixtureRepository.findAllFixtureViews();

        assertEquals(2, fixtures.size());

        FixtureRepository.FixtureView assigned = fixtures.stream()
                .filter(fixture -> fixture.getId().equals(100))
                .findFirst()
                .orElseThrow();

        assertEquals(1, assigned.getEventId());
        assertEquals(kickoff, assigned.getKickoffTime());
        assertEquals(1, assigned.getHomeTeamId());
        assertEquals("Home Team", assigned.getHomeTeamName());
        assertEquals("HOM", assigned.getHomeTeamShortName());
        assertEquals(2, assigned.getAwayTeamId());
        assertEquals("Away Team", assigned.getAwayTeamName());
        assertEquals("AWY", assigned.getAwayTeamShortName());
        assertEquals(10, assigned.getHomeTeamCode());
        assertEquals(20, assigned.getAwayTeamCode());

        FixtureRepository.FixtureView unassigned = fixtures.stream()
                .filter(fixture -> fixture.getId().equals(101))
                .findFirst()
                .orElseThrow();

        assertNull(unassigned.getEventId());
        assertNull(unassigned.getKickoffTime());
    }

    private void insertTeam(int id, String name, String shortName) {
        jdbcTemplate.update(
                """
                INSERT INTO teams (id, name, short_name, position, code)
                VALUES (?, ?, ?, ?, ?)
                """,
                id,
                name,
                shortName,
                id,
                id * 10
        );
    }

    private void insertEvent(int id, String name) {
        jdbcTemplate.update(
                """
                INSERT INTO events (id, name, payload)
                VALUES (?, ?, CAST(? AS jsonb))
                """,
                id,
                name,
                "{}"
        );
    }

    private void insertFixture(int id, Integer eventId, Instant kickoff) {
        jdbcTemplate.update(connection -> {
            var statement = connection.prepareStatement("""
                INSERT INTO fixtures (
                    id,
                    code,
                    event,
                    finished,
                    finished_provisional,
                    kickoff_time,
                    minutes,
                    provisional_start_time,
                    started,
                    team_a,
                    team_a_score,
                    team_h,
                    team_h_score,
                    team_h_difficulty,
                    team_a_difficulty,
                    pulse_id
                )
                VALUES (?, ?, ?, false, false, ?, 0, false, false, ?, NULL, ?, NULL, 2, 3, 0)
                """);

            statement.setInt(1, id);
            statement.setInt(2, 2645195 + id);

            if (eventId == null) {
                statement.setNull(3, Types.INTEGER);
            } else {
                statement.setInt(3, eventId);
            }

            if (kickoff == null) {
                statement.setNull(4, Types.TIMESTAMP_WITH_TIMEZONE);
            } else {
                statement.setObject(4, kickoff.atOffset(ZoneOffset.UTC));
            }

            statement.setInt(5, 2);
            statement.setInt(6, 1);
            return statement;
        });
    }
}