package com.jamesthoburn.fplsuite.event;

import com.jamesthoburn.fplsuite.exception.NextGameweekUnavailableException;
import com.jamesthoburn.fplsuite.exception.SeasonDataUnavailableException;
import com.jamesthoburn.fplsuite.exception.SeasonEndedException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

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

    @Test
    void returnsNextGameweekWhenFlagged() {
        Instant deadline = Instant.parse("2026-08-28T17:30:00Z");
        when(eventRepository.findFirstByNextTrueOrderByDeadlineTimeAsc())
                .thenReturn(Optional.of(nextEvent(2, "Gameweek 2", deadline)));

        NextGameweekResponse next = seasonService.getNextGameweek();

        assertEquals(2, next.id());
        assertEquals("Gameweek 2", next.name());
        assertEquals(deadline, next.deadlineTime());
        verify(eventRepository, never()).findTopByOrderByIdDesc();
    }

    @Test
    void reportsSeasonEndedWhenNoNextAndFinalEventIsCurrent() {
        when(eventRepository.findFirstByNextTrueOrderByDeadlineTimeAsc())
                .thenReturn(Optional.empty());
        when(eventRepository.findTopByOrderByIdDesc())
                .thenReturn(Optional.of(seasonEnd(38, true, false)));

        SeasonEndedException exception = assertThrows(
                SeasonEndedException.class,
                () -> seasonService.getNextGameweek()
        );

        assertEquals("Final gameweek 38 reached", exception.getMessage());
    }
    @Test
    void reportsSeasonEndedWhenNoNextAndFinalEventIsFinished() {
        when(eventRepository.findFirstByNextTrueOrderByDeadlineTimeAsc())
                .thenReturn(Optional.empty());
        when(eventRepository.findTopByOrderByIdDesc())
                .thenReturn(Optional.of(seasonEnd(38, false, true)));

        assertThrows(
                SeasonEndedException.class,
                () -> seasonService.getNextGameweek()
        );
    }

    @Test
    void reportsUnavailableWhenNoNextAndFinalEventIsNeitherCurrentNorFinished() {
        when(eventRepository.findFirstByNextTrueOrderByDeadlineTimeAsc())
                .thenReturn(Optional.empty());
        when(eventRepository.findTopByOrderByIdDesc())
                .thenReturn(Optional.of(seasonEnd(38, false, false)));

        NextGameweekUnavailableException exception = assertThrows(
                NextGameweekUnavailableException.class,
                () -> seasonService.getNextGameweek()
        );

        assertEquals(
                "No is_next flag set, but final event 38 is neither current nor finished",
                exception.getMessage()
        );
    }

    @Test
    void treatsNullFlagsOnFinalEventAsNotEnded() {
        when(eventRepository.findFirstByNextTrueOrderByDeadlineTimeAsc())
                .thenReturn(Optional.empty());
        when(eventRepository.findTopByOrderByIdDesc())
                .thenReturn(Optional.of(seasonEnd(38, null, null)));

        assertThrows(
                NextGameweekUnavailableException.class,
                () -> seasonService.getNextGameweek()
        );
    }

    @Test
    void reportsUnavailableWhenEventsTableIsEmpty() {
        when(eventRepository.findFirstByNextTrueOrderByDeadlineTimeAsc())
                .thenReturn(Optional.empty());
        when(eventRepository.findTopByOrderByIdDesc())
                .thenReturn(Optional.empty());

        NextGameweekUnavailableException exception = assertThrows(
                NextGameweekUnavailableException.class,
                () -> seasonService.getNextGameweek()
        );

        assertEquals("Events table is empty", exception.getMessage());
    }

    private static EventRepository.NextEventView nextEvent(Integer id, String name, Instant deadlineTime) {
        return new EventRepository.NextEventView() {
            @Override
            public Integer getId() {
                return id;
            }

            @Override
            public String getName() {
                return name;
            }

            @Override
            public Instant getDeadlineTime() {
                return deadlineTime;
            }
        };
    }

    private static EventRepository.SeasonEndView seasonEnd(Integer id, Boolean current, Boolean finished) {
        return new EventRepository.SeasonEndView() {
            @Override
            public Integer getId() {
                return id;
            }

            @Override
            public Boolean getCurrent() {
                return current;
            }

            @Override
            public Boolean getFinished() {
                return finished;
            }
        };
    }
}
