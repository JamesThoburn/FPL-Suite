package com.jamesthoburn.fplsuite.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="players")
@Getter
@Setter
public class Player {
    @Id
    @Column(nullable = false)
    private Integer id;

    @Column(nullable = false)
    private Integer code;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String secondName;

    @Column(nullable = false)
    private String webName;

    @Column(nullable = false)
    private String elementTypeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(nullable = false)
    private Integer nowCost;

    @Column(length = 1, nullable = false)
    private String status;

    private String news;

    @Column(nullable = false)
    private Integer totalPoints;

    private Double form;

    private Double selectedByPercent;

    private Integer minutes;
    private Integer goalsScored;
    private Integer assists;
    private Integer cleanSheets;
    private Integer goalsConceded;
    private Integer ownGoals;
    private Integer penaltiesSaved;
    private Integer penaltiesMissed;
    private Integer yellowCards;
    private Integer redCards;
    private Integer saves;

    private Integer bonus;
    private Integer bps;

    private Double expectedGoals;
    private Double expectedAssists;
    private Double expectedGoalInvolvements;
    private Double expectedGoalsConceded;
}
