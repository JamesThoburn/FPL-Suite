package com.jamesthoburn.fplsuite.event;

import com.jamesthoburn.fplsuite.exception.NextGameweekUnavailableException;
import com.jamesthoburn.fplsuite.exception.SeasonDataUnavailableException;
import com.jamesthoburn.fplsuite.exception.SeasonEndedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SeasonService {
    private final EventRepository eventRepository;

    public SeasonService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public CurrentSeasonResponse getCurrentSeason() {
        SeasonYearProjection years = eventRepository.findSeasonYears();

        if (years == null || years.getStartYear() == null || years.getEndYear() == null) {
            throw new SeasonDataUnavailableException(
                    "No event deadlines are available to determine the season"
            );
        }

        Integer startYear = years.getStartYear();
        Integer endYear = years.getEndYear();

        if (endYear != startYear + 1) {
            throw new SeasonDataUnavailableException(
                    "Stored event deadlines do not identify one season"
            );
        }

        String label = "%d/%02d".formatted(startYear, endYear % 100);
        return new CurrentSeasonResponse(startYear, endYear, label);
    }

    @Transactional(readOnly = true)
    public NextGameweekResponse getNextGameweek() {
        return eventRepository.findFirstByNextTrueOrderByDeadlineTimeAsc()
                .map(e -> new NextGameweekResponse(e.getId(), e.getName(), e.getDeadlineTime()))
                .orElseGet(this::resolveMissingNextGameweek);
    }

    private NextGameweekResponse resolveMissingNextGameweek() {
        EventRepository.SeasonEndView last = eventRepository.findTopByOrderByIdDesc()
                .orElseThrow(() -> new NextGameweekUnavailableException("Events table is empty"));

        if (Boolean.TRUE.equals(last.getCurrent()) || Boolean.TRUE.equals(last.getFinished())) {
            throw new SeasonEndedException("Final gameweek " + last.getId() + " reached");
        }

        throw new NextGameweekUnavailableException("No is_next flag set, but final event " + last.getId() + " is neither current nor finished");
    }
}
