CREATE TABLE events (
    id integer PRIMARY KEY,
    name text NOT NULL,
    deadline_time timestamptz,
    release_time timestamptz,

    average_entry_score integer,
    finished boolean,
    data_checked boolean,
    highest_scoring_entry bigint,
    deadline_time_epoch bigint,
    deadline_time_game_offset integer,
    highest_score integer,

    transfers_made bigint,

    is_previous boolean,
    is_current boolean,
    is_next boolean,

    cup_leagues_created boolean,
    h2h_ko_matches_created boolean,
    can_enter boolean,
    can_manage boolean,

    most_selected integer REFERENCES players(id),
    most_transferred_in integer REFERENCES players(id),
    top_element integer REFERENCES players(id),
    most_captained integer REFERENCES players(id),
    most_vice_captained integer REFERENCES players(id),

    payload jsonb NOT NULL
        CHECK (jsonb_typeof(payload) = 'object'),

    synced_at timestamptz NOT NULL DEFAULT now()
);