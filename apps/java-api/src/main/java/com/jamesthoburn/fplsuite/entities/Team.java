package com.jamesthoburn.fplsuite.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="teams")
@Getter
@Setter
public class Team {
    @Id
    @Column(nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 3)
    private String shortName;

    @Column(nullable = false)
    private Integer position;

    @Column(nullable = false)
    private Integer code;
}
