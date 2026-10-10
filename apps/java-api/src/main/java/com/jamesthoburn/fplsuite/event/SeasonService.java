package com.jamesthoburn.fplsuite.event;

import com.jamesthoburn.fplsuite.exception.SeasonDataUnavailableException;
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
}
