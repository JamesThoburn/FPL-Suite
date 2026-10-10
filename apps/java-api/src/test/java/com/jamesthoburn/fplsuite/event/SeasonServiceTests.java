package com.jamesthoburn.fplsuite.event;

import com.jamesthoburn.fplsuite.exception.SeasonDataUnavailableException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SeasonServiceTests {
    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private SeasonService seasonService;

    @Test
    void returnsSeasonLabelFromStoredDeadlineYears() {
        when(eventRepository.findSeasonYears()).thenReturn(years(2026, 2027));

        CurrentSeasonResponse season = seasonService.getCurrentSeason();

        assertEquals(2026, season.startYear());
        assertEquals(2027, season.endYear());
        assertEquals("2026/27", season.label());
        verify(eventRepository).findSeasonYears();
    }

    @Test
    void reportsUnavailableWhenNoDeadlinesExist() {
        when(eventRepository.findSeasonYears()).thenReturn(years(null, null));

        SeasonDataUnavailableException exception = assertThrows(
                SeasonDataUnavailableException.class,
                () -> seasonService.getCurrentSeason()
        );

        assertEquals(
                "No event deadlines are available to determine the season",
                exception.getMessage()
        );
        verify(eventRepository).findSeasonYears();
    }

    @Test
    void reportsUnavailableWhenDeadlineYearsDoNotSpanOneSeason() {
        when(eventRepository.findSeasonYears()).thenReturn(years(2026, 2028));

        SeasonDataUnavailableException exception = assertThrows(
                SeasonDataUnavailableException.class,
                () -> seasonService.getCurrentSeason()
        );

        assertEquals(
                "Stored event deadlines do not identify one season",
                exception.getMessage()
        );
        verify(eventRepository).findSeasonYears();
    }

    @Test
    void reportsUnavailableWhenRepositoryReturnsNoProjection() {
        when(eventRepository.findSeasonYears()).thenReturn(null);

        SeasonDataUnavailableException exception = assertThrows(
                SeasonDataUnavailableException.class,
                () -> seasonService.getCurrentSeason()
        );

        assertEquals(
                "No event deadlines are available to determine the season",
                exception.getMessage()
        );
        verify(eventRepository).findSeasonYears();
    }

    private static SeasonYearProjection years(Integer startYear, Integer endYear) {
        return new SeasonYearProjection() {
            @Override
            public Integer getStartYear() {
                return startYear;
            }

            @Override
            public Integer getEndYear() {
                return endYear;
            }
        };
    }
}
