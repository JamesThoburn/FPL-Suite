package com.jamesthoburn.fplsuite.event;

import com.jamesthoburn.fplsuite.exception.SeasonDataUnavailableException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SeasonController.class)
public class SeasonControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SeasonService seasonService;

    @Test
    void returnsCurrentSeasonAsJson() throws Exception {
        when(seasonService.getCurrentSeason()).thenReturn(
                new CurrentSeasonResponse(2026, 2027, "2026/27")
        );

        mockMvc.perform(get("/api/v1/season/current"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.startYear").value(2026))
                .andExpect(jsonPath("$.endYear").value(2027))
                .andExpect(jsonPath("$.label").value("2026/27"));
    }

    @Test
    void mapsUnavailableSeasonToServiceUnavailableProblemDetail () throws Exception {
        when(seasonService.getCurrentSeason()).thenThrow(
                new SeasonDataUnavailableException(
                        "No event deadlines are available to determine the season"
                )
        );

        mockMvc.perform(get("/api/v1/season/current"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(503))
                .andExpect(jsonPath("$.detail").value(
                        "No event deadlines are available to determine the season"
                ));
    }
}
