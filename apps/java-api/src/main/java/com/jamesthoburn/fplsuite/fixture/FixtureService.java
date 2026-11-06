package com.jamesthoburn.fplsuite.fixture;

import com.jamesthoburn.fplsuite.event.Event;
import com.jamesthoburn.fplsuite.event.EventRepository;
import com.jamesthoburn.fplsuite.exception.SeasonDataUnavailableException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FixtureService {
    private final FixtureRepository fixtureRepository;
    private final EventRepository eventRepository;

    public FixtureService(
            FixtureRepository fixtureRepository,
            EventRepository eventRepository
    ) {
        this.fixtureRepository = fixtureRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public FixturesResponse getFixtures() {
        List<FixtureRepository.FixtureView> fixtureViews = fixtureRepository.findAllFixtureViews();

        if (fixtureViews.isEmpty()) {
            throw new SeasonDataUnavailableException(
                    "No fixtures are available"
            );
        }

        List<Event> events = eventRepository.findAllByOrderByIdAsc();

        if (events.isEmpty()) {
            throw new SeasonDataUnavailableException(
                    "No gameweeks are available"
            );
        }

        Integer defaultGameweekId = resolveDefaultGameweekId(events);

        Map<Integer, Instant> firstKickoffByGameweek = new HashMap<>();
        Map<Integer, Instant> lastKickoffByGameweek = new HashMap<>();

        for (FixtureRepository.FixtureView fixture : fixtureViews) {
            Integer eventId = fixture.getEventId();
            Instant kickoffTime = fixture.getKickoffTime();

            if (eventId == null || kickoffTime == null) {
                continue;
            }

            firstKickoffByGameweek.merge(
                    eventId,
                    kickoffTime,
                    (current, candidate) -> current.isBefore(candidate) ? current : candidate
            );
            lastKickoffByGameweek.merge(
                    eventId,
                    kickoffTime,
                    (current, candidate) -> current.isAfter(candidate) ? current : candidate
            );
        }

        List<FixturesResponse.Gameweek> gameweeks = events.stream()
                .map(event -> new FixturesResponse.Gameweek(
                        event.getId(),
                        event.getName(),
                        Boolean.TRUE.equals(event.getFinished()),
                        Boolean.TRUE.equals(event.getCurrent()),
                        Boolean.TRUE.equals(event.getNext()),
                        firstKickoffByGameweek.get(event.getId()),
                        lastKickoffByGameweek.get(event.getId())
                ))
                .toList();

        List<FixturesResponse.Fixture> fixtures = fixtureViews.stream()
                .map(this::toResponse)
                .toList();

        return new FixturesResponse(defaultGameweekId, gameweeks, fixtures);
    }

    private Integer resolveDefaultGameweekId(List<Event> events) {
        Event currentEvent = events.stream()
                .filter(event -> Boolean.TRUE.equals(event.getCurrent()))
                .findFirst()
                .orElse(null);

        Event nextEvent = events.stream()
                .filter(event -> Boolean.TRUE.equals(event.getNext()))
                .findFirst()
                .orElse(null);

        if (currentEvent != null && !Boolean.TRUE.equals(currentEvent.getFinished())) {
            return currentEvent.getId();
        }

        if (nextEvent != null) {
            return nextEvent.getId();
        }

        Event lastEvent = events.getLast();
        if (Boolean.TRUE.equals(lastEvent.getCurrent())
                || Boolean.TRUE.equals(lastEvent.getFinished())) {
            return lastEvent.getId();
        }

        throw new SeasonDataUnavailableException(
                "Unable to determine the default gameweek"
        );
    }

    private FixturesResponse.Fixture toResponse(
            FixtureRepository.FixtureView fixture
    ) {
        return new FixturesResponse.Fixture(
                fixture.getId(),
                fixture.getCode(),
                fixture.getEventId(),
                Boolean.TRUE.equals(fixture.getFinished()),
                Boolean.TRUE.equals(fixture.getFinishedProvisional()),
                fixture.getKickoffTime(),
                fixture.getMinutes(),
                Boolean.TRUE.equals(fixture.getProvisionalStartTime()),
                Boolean.TRUE.equals(fixture.getStarted()),
                fixture.getHomeScore(),
                fixture.getAwayScore(),
                fixture.getHomeDifficulty(),
                fixture.getAwayDifficulty(),
                new FixturesResponse.Team(
                        fixture.getHomeTeamId(),
                        fixture.getHomeTeamName(),
                        fixture.getHomeTeamShortName(),
                        fixture.getHomeTeamCode()
                ),
                new FixturesResponse.Team(
                        fixture.getAwayTeamId(),
                        fixture.getAwayTeamName(),
                        fixture.getAwayTeamShortName(),
                        fixture.getAwayTeamCode()
                )
        );
    }
}
