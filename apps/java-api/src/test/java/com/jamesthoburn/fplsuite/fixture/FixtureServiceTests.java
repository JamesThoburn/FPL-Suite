package com.jamesthoburn.fplsuite.fixture;

import com.jamesthoburn.fplsuite.event.Event;
import com.jamesthoburn.fplsuite.event.EventRepository;
import com.jamesthoburn.fplsuite.exception.SeasonDataUnavailableException;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FixtureServiceTests {
    private final FixtureRepository fixtureRepository =
            mock(FixtureRepository.class);
    private final EventRepository eventRepository =
            mock(EventRepository.class);
    private final FixtureService fixtureService =
            new FixtureService(fixtureRepository, eventRepository);

    @Test
    void selectsUnfinishedCurrentWeekAndCalculatesKickoffBounds() {
        Instant firstKickoff = Instant.parse("2026-08-21T19:00:00Z");
        Instant lastKickoff = Instant.parse("2026-08-23T16:30:00Z");

        List<FixtureRepository.FixtureView> fixtureViews = List.of(
                fixtureView(1, 1, lastKickoff),
                fixtureView(2, 1, firstKickoff),
                fixtureView(3, null, Instant.parse("2026-08-24T18:00:00Z")),
                fixtureView(4, 2, null)
        );

        when(fixtureRepository.findAllFixtureViews()).thenReturn(fixtureViews);
        when(eventRepository.findAllByOrderByIdAsc()).thenReturn(List.of(
                event(1, false, true, false),
                event(2, false, false, true)
        ));

        FixturesResponse response = fixtureService.getFixtures();

        assertEquals(1, response.defaultGameweekId());
        assertEquals(4, response.fixtures().size());

        FixturesResponse.Gameweek gameweekOne = response.gameweeks().getFirst();
        assertEquals(1, gameweekOne.id());
        assertEquals(firstKickoff, gameweekOne.firstKickoffTime());
        assertEquals(lastKickoff, gameweekOne.lastKickoffTime());
        assertEquals(10, response.fixtures().getFirst().homeTeam().code());
        assertEquals(20, response.fixtures().getFirst().awayTeam().code());

        FixturesResponse.Gameweek gameweekTwo = response.gameweeks().get(1);
        assertEquals(2, gameweekTwo.id());
        assertNull(gameweekTwo.firstKickoffTime());
        assertNull(gameweekTwo.lastKickoffTime());

        assertNull(response.fixtures().get(2).eventId());
    }

    @Test
    void selectsNextWeekWhenCurrentWeekIsFinished() {
        List<FixtureRepository.FixtureView> fixtureViews = List.of(
                fixtureView(
                        1,
                        1,
                        Instant.parse("2026-08-21T19:00:00Z")
                )
        );

        when(fixtureRepository.findAllFixtureViews()).thenReturn(fixtureViews);
        when(eventRepository.findAllByOrderByIdAsc()).thenReturn(List.of(
                event(1, true, true, false),
                event(2, false, false, true)
        ));

        FixturesResponse response = fixtureService.getFixtures();

        assertEquals(2, response.defaultGameweekId());
    }

    @Test
    void selectsNextWeekWhenNoWeekIsMarkedCurrent() {
        List<FixtureRepository.FixtureView> fixtureViews = List.of(
                fixtureView(
                        1,
                        2,
                        Instant.parse("2026-08-28T19:00:00Z")
                )
        );

        when(fixtureRepository.findAllFixtureViews()).thenReturn(fixtureViews);
        when(eventRepository.findAllByOrderByIdAsc()).thenReturn(List.of(
                event(1, true, false, false),
                event(2, false, false, true)
        ));

        FixturesResponse response = fixtureService.getFixtures();

        assertEquals(2, response.defaultGameweekId());
    }

    @Test
    void selectsFinalWeekWhenSeasonHasEnded() {
        List<FixtureRepository.FixtureView> fixtureViews = List.of(
                fixtureView(
                        1,
                        38,
                        Instant.parse("2027-05-23T15:00:00Z")
                )
        );

        when(fixtureRepository.findAllFixtureViews()).thenReturn(fixtureViews);
        when(eventRepository.findAllByOrderByIdAsc()).thenReturn(List.of(
                event(37, true, false, false),
                event(38, true, false, false)
        ));

        FixturesResponse response = fixtureService.getFixtures();

        assertEquals(38, response.defaultGameweekId());
    }

    @Test
    void throwsWhenDefaultWeekCannotBeDetermined() {
        List<FixtureRepository.FixtureView> fixtureViews = List.of(
                fixtureView(
                        1,
                        1,
                        Instant.parse("2026-08-21T19:00:00Z")
                )
        );

        when(fixtureRepository.findAllFixtureViews()).thenReturn(fixtureViews);
        when(eventRepository.findAllByOrderByIdAsc()).thenReturn(List.of(
                event(1, false, false, false)
        ));

        assertThrows(
                SeasonDataUnavailableException.class,
                fixtureService::getFixtures
        );
    }

    @Test
    void throwsWhenNoFixturesExist() {
        when(fixtureRepository.findAllFixtureViews()).thenReturn(List.of());

        assertThrows(
                SeasonDataUnavailableException.class,
                fixtureService::getFixtures
        );
        verifyNoInteractions(eventRepository);
    }

    @Test
    void throwsWhenNoGameweeksExist() {
        List<FixtureRepository.FixtureView> fixtureViews = List.of(
                fixtureView(
                        1,
                        1,
                        Instant.parse("2026-08-21T19:00:00Z")
                )
        );

        when(fixtureRepository.findAllFixtureViews()).thenReturn(fixtureViews);
        when(eventRepository.findAllByOrderByIdAsc()).thenReturn(List.of());

        assertThrows(
                SeasonDataUnavailableException.class,
                fixtureService::getFixtures
        );
    }

    private static Event event(
            int id,
            boolean finished,
            boolean current,
            boolean next
    ) {
        Event event = new Event();
        event.setId(id);
        event.setName("Gameweek " + id);
        event.setFinished(finished);
        event.setCurrent(current);
        event.setNext(next);
        return event;
    }

    private static FixtureRepository.FixtureView fixtureView(
            int id,
            Integer eventId,
            Instant kickoffTime
    ) {
        FixtureRepository.FixtureView view =
                mock(FixtureRepository.FixtureView.class);

        when(view.getId()).thenReturn(id);
        when(view.getCode()).thenReturn(2645195 + id);
        when(view.getEventId()).thenReturn(eventId);
        when(view.getFinished()).thenReturn(false);
        when(view.getFinishedProvisional()).thenReturn(false);
        when(view.getKickoffTime()).thenReturn(kickoffTime);
        when(view.getMinutes()).thenReturn(0);
        when(view.getProvisionalStartTime()).thenReturn(false);
        when(view.getStarted()).thenReturn(false);
        when(view.getHomeScore()).thenReturn(null);
        when(view.getAwayScore()).thenReturn(null);
        when(view.getHomeDifficulty()).thenReturn(2);
        when(view.getAwayDifficulty()).thenReturn(3);
        when(view.getHomeTeamId()).thenReturn(1);
        when(view.getHomeTeamName()).thenReturn("Home Team");
        when(view.getHomeTeamShortName()).thenReturn("HOM");
        when(view.getAwayTeamId()).thenReturn(2);
        when(view.getAwayTeamName()).thenReturn("Away Team");
        when(view.getAwayTeamShortName()).thenReturn("AWY");
        when(view.getHomeTeamCode()).thenReturn(10);
        when(view.getAwayTeamCode()).thenReturn(20);

        return view;
    }
}