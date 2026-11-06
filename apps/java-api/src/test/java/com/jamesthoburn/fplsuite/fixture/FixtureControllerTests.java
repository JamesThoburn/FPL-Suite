package com.jamesthoburn.fplsuite.fixture;

import com.jamesthoburn.fplsuite.exception.ApiExceptionHandler;
import com.jamesthoburn.fplsuite.exception.SeasonDataUnavailableException;
import com.jamesthoburn.fplsuite.security.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FixtureController.class)
@Import({SecurityConfig.class, ApiExceptionHandler.class})
@TestPropertySource(properties = {
        "app.cors.allowed-origin=http://localhost:3000",
        "supabase.jwt.issuer=https://example.supabase.co/auth/v1",
        "supabase.jwt.jwks-uri=https://example.supabase.co/auth/v1/.well-known/jwks.json"
})
class FixtureControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private FixtureService fixtureService;

    @Test
    void fixturesRouteIsPublicAndReturnsFixturesAndGameweekMetadata()
            throws Exception {
        Instant kickoff = Instant.parse("2026-08-21T19:00:00Z");
        FixturesResponse response = new FixturesResponse(
                1,
                List.of(new FixturesResponse.Gameweek(
                        1,
                        "Gameweek 1",
                        false,
                        true,
                        false,
                        kickoff,
                        kickoff
                )),
                List.of(new FixturesResponse.Fixture(
                        100,
                        2645295,
                        1,
                        false,
                        false,
                        kickoff,
                        0,
                        false,
                        false,
                        null,
                        null,
                        2,
                        3,
                        new FixturesResponse.Team(1, "Home Team", "HOM", 10),
                        new FixturesResponse.Team(2, "Away Team", "AWY", 20)
                ))
        );

        when(fixtureService.getFixtures()).thenReturn(response);

        mockMvc.perform(get("/api/v1/fixtures"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.defaultGameweekId").value(1))
                .andExpect(jsonPath("$.gameweeks[0].id").value(1))
                .andExpect(jsonPath("$.gameweeks[0].name").value("Gameweek 1"))
                .andExpect(jsonPath("$.gameweeks[0].firstKickoffTime")
                        .value("2026-08-21T19:00:00Z"))
                .andExpect(jsonPath("$.gameweeks[0].lastKickoffTime")
                        .value("2026-08-21T19:00:00Z"))
                .andExpect(jsonPath("$.fixtures[0].id").value(100))
                .andExpect(jsonPath("$.fixtures[0].eventId").value(1))
                .andExpect(jsonPath("$.fixtures[0].homeTeam.name").value("Home Team"))
                .andExpect(jsonPath("$.fixtures[0].homeTeam.shortName").value("HOM"))
                .andExpect(jsonPath("$.fixtures[0].awayTeam.name").value("Away Team"))
                .andExpect(jsonPath("$.fixtures[0].homeDifficulty").value(2))
                .andExpect(jsonPath("$.fixtures[0].awayDifficulty").value(3))
                .andExpect(jsonPath("$.fixtures[0].homeTeam.code").value(10))
                .andExpect(jsonPath("$.fixtures[0].awayTeam.code").value(20));

        verify(fixtureService).getFixtures();
    }

    @Test
    void mapsUnavailableFixtureDataToServiceUnavailableProblemDetail()
            throws Exception {
        when(fixtureService.getFixtures()).thenThrow(
                new SeasonDataUnavailableException("No fixtures are available")
        );

        mockMvc.perform(get("/api/v1/fixtures"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(content().contentTypeCompatibleWith(
                        MediaType.APPLICATION_PROBLEM_JSON
                ))
                .andExpect(jsonPath("$.status").value(503))
                .andExpect(jsonPath("$.detail").value("No fixtures are available"));
    }
}