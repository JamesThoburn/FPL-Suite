package com.jamesthoburn.fplsuite.event;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/season")
public class SeasonController {
    private final SeasonService seasonService;

    public SeasonController(SeasonService seasonService) {
        this.seasonService = seasonService;
    }

    @GetMapping("/current")
    public CurrentSeasonResponse getCurrentSeason() {
        return seasonService.getCurrentSeason();
    }
}
