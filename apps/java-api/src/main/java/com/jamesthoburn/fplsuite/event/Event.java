package com.jamesthoburn.fplsuite.event;

import com.jamesthoburn.fplsuite.player.Player;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import tools.jackson.databind.JsonNode;

import java.time.Instant;

@Entity
@Table(name="events")
@Getter
@Setter
public class Event {
    @Id
    @Column(nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String name;

    private Instant deadlineTime;

    private Instant releaseTime;

    private Integer averageEntryScore;

    private Boolean finished;

    private Boolean dataChecked;

    private Long highestScoringEntry;

    private Long deadlineTimeEpoch;

    private Integer deadlineTimeGameOffset;

    private Integer highestScore;

    private Long transfersMade;

    @Column(name = "is_previous")
    private Boolean previous;

    @Column(name = "is_current")
    private Boolean current;

    @Column(name = "is_next")
    private Boolean next;

    private Boolean cupLeaguesCreated;

    private Boolean h2hKoMatchesCreated;

    @Column(name = "can_enter")
    private Boolean canEnter;

    @Column(name = "can_manage")
    private Boolean canManage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "most_selected", foreignKey = @ForeignKey(name="fk_events_most_selected_player"))
    private Player mostSelected;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "most_transferred_in", foreignKey = @ForeignKey(name="fk_events_most_transferred_in_player"))
    private Player mostTransferredIn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "top_element", foreignKey = @ForeignKey(name="fk_events_top_element_player"))
    private Player topElement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "most_captained", foreignKey = @ForeignKey(name="fk_events_most_captained_player"))
    private Player mostCaptained;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "most_vice_captained", foreignKey = @ForeignKey(name="fk_events_most_vice_captained_player"))
    private Player mostViceCaptained;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private JsonNode payload;

    @Column(nullable = false)
    private Instant syncedAt;
}
