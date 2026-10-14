package com.jamesthoburn.fplsuite.profile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.util.UUID;

@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "display_name", nullable = false, length = 80)
    private String displayName;

    @Column(name = "fpl_manager_id")
    private Long fplManagerId;

    protected Profile() {}

    public Profile(UUID userId, String displayName, Long fplManagerId) {
        this.userId = userId;
        this.displayName = displayName;
        this.fplManagerId = fplManagerId;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public Long getFplManagerId() {
        return fplManagerId;
    }

    public void update(String displayName, Long fplManagerId) {
        this.displayName = displayName;
        this.fplManagerId = fplManagerId;
    }
}
