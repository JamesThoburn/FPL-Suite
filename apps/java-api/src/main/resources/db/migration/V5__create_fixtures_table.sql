CREATE TABLE fixtures (
    id INTEGER PRIMARY KEY,
    code INTEGER NOT NULL,
    event INTEGER REFERENCES events(id) ON DELETE SET NULL,
    finished BOOLEAN NOT NULL,
    finished_provisional BOOLEAN NOT NULL,
    kickoff_time timestamptz,
    minutes INTEGER NOT NULL,
    provisional_start_time BOOLEAN NOT NULL,
    started BOOLEAN NOT NULL,
    team_a INTEGER NOT NULL REFERENCES teams(id),
    team_a_score INTEGER,
    team_h INTEGER NOT NULL REFERENCES teams(id),
    team_h_score INTEGER,
    team_h_difficulty SMALLINT NOT NULL
                      CHECK ( team_h_difficulty BETWEEN 1 AND 5 ),
    team_a_difficulty SMALLINT NOT NULL
                      CHECK ( team_a_difficulty BETWEEN 1 AND 5 ),
    pulse_id INTEGER NOT NULL,
    synced_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE fixture_stats (
    fixture_id INTEGER NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
    identifier TEXT NOT NULL,
    side CHAR(1) NOT NULL CHECK (side IN ('a', 'h')),
    player_id INTEGER NOT NULL REFERENCES players(id),
    value INTEGER NOT NULL,
    PRIMARY KEY (fixture_id, identifier, side, player_id)
);