package com.jamesthoburn.fplsuite.fixture;

import com.jamesthoburn.fplsuite.event.Event;
import com.jamesthoburn.fplsuite.team.Team;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "fixtures")
@Getter
@Setter
public class Fixture {
    @Id
    @Column(nullable = false)
    private Integer id;

    @Column(nullable = false)
    private Integer code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event")
    private Event event;

    @Column(nullable = false)
    private Boolean finished;

    @Column(name = "finished_provisional", nullable = false)
    private Boolean finishedProvisional;

    private Instant kickoffTime;

    @Column(nullable = false)
    private Integer minutes;

    @Column(name = "provisional_start_time", nullable = false)
    private Boolean provisionalStartTime;

    @Column(nullable = false)
    private Boolean started;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_h", nullable = false)
    private Team homeTeam;

    @Column(name = "team_h_score")
    private Integer homeScore;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_a", nullable = false)
    private Team awayTeam;

    @Column(name = "team_a_score")
    private Integer awayScore;

    @Column(name = "team_h_difficulty", nullable = false)
    private Integer homeDifficulty;

    @Column(name = "team_a_difficulty", nullable = false)
    private Integer awayDifficulty;

    @Column(name = "pulse_id", nullable = false)
    private Integer pulseId;

    @Column(nullable = false)
    private Instant syncedAt;
}