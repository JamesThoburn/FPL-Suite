from datetime import datetime, timezone
from psycopg2.extras import Json, execute_values

from .fpl_client import FPLClient

# (db column name, official FPL API field name, required?)
PLAYER_FIELDS = (
    ("id", "id", True),
    ("code", "code", True),
    ("first_name", "first_name", True),
    ("second_name", "second_name", True),
    ("web_name", "web_name", True),
    ("element_type_id", "element_type", True),
    ("team_id", "team", True),
    ("now_cost", "now_cost", True),
    ("status", "status", True),
    ("total_points", "total_points", True),
    ("chance_of_playing_next_round", "chance_of_playing_next_round", False),
    ("news", "news", False),
    ("form", "form", False),
    ("selected_by_percent", "selected_by_percent", False),
    ("minutes", "minutes", False),
    ("goals_scored", "goals_scored", False),
    ("assists", "assists", False),
    ("clean_sheets", "clean_sheets", False),
    ("goals_conceded", "goals_conceded", False),
    ("own_goals", "own_goals", False),
    ("penalties_saved", "penalties_saved", False),
    ("penalties_missed", "penalties_missed", False),
    ("yellow_cards", "yellow_cards", False),
    ("red_cards", "red_cards", False),
    ("saves", "saves", False),
    ("bonus", "bonus", False),
    ("bps", "bps", False),
    ("expected_goals", "expected_goals", False),
    ("expected_assists", "expected_assists", False),
    ("expected_goal_involvements", "expected_goal_involvements", False),
    ("expected_goals_conceded", "expected_goals_conceded", False)
)

EVENT_COLUMNS = (
    "id",
    "name",
    "deadline_time",
    "release_time",
    "average_entry_score",
    "finished",
    "data_checked",
    "highest_scoring_entry",
    "deadline_time_epoch",
    "deadline_time_game_offset",
    "highest_score",
    "transfers_made",
    "is_previous",
    "is_current",
    "is_next",
    "cup_leagues_created",
    "h2h_ko_matches_created",
    "can_enter",
    "can_manage",
    "most_selected",
    "most_transferred_in",
    "top_element",
    "most_captained",
    "most_vice_captained",
)

PLAYER_COLUMNS = tuple(col for col, _, _ in PLAYER_FIELDS)
TEAM_COLUMNS = ("id", "name", "short_name", "position", "code")
EVENT_UPSERT_COLUMNS = (*EVENT_COLUMNS, "payload", "synced_at")
EVENT_TEMPLATE = "(" + ", ".join(["%s"] * (len(EVENT_COLUMNS) + 1)) + ", now())"
TEAM_REQUIRED_KEYS = TEAM_COLUMNS
PLAYER_REQUIRED_KEYS = tuple(src for _, src, required in PLAYER_FIELDS if required)

def player_row(player):
    return tuple(
        player[src] if required else player.get(src)
        for _, src, required in PLAYER_FIELDS
    )

def validate_records(records, label, required_keys):
    if not isinstance(records, list) or not records:
        raise ValueError(f"FPL bootstrap {label} must be a non-empty list")

    seen_ids = set()

    for record in records:
        if not isinstance(record, dict):
            raise ValueError(f"FPL bootstrap {label} must contain objects")

        record_id = record.get("id")
        if type(record_id) is not int or record_id <= 0:
            raise ValueError(f"FPL {label} entry must have a positive integer id")

        if record_id in seen_ids:
            raise ValueError(f"Duplicate FPL {label} id: {record_id}")
        seen_ids.add(record_id)

        missing = [key for key in required_keys if key not in record]
        if missing:
            raise ValueError(
                f"FPL {label} {record_id} is missing fields: {', '.join(missing)}"
            )

def parse_event_timestamp(value, event_id: int, field: str):
    if value is None:
        return None

    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"FPL event {event_id} has an invalid {field}")

    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValueError(
            f"FPL event {event_id} has an invalid {field}"
        ) from exc

    if parsed.tzinfo is None:
        raise ValueError(
            f"FPL event {event_id} {field} must include a timezone"
        )

    return parsed.astimezone(timezone.utc)

def prepare_events(events):
    if not isinstance(events, list) or not events:
        raise ValueError("FPL bootstrap events must be a non-empty list")

    prepared = []
    seen_ids = set()

    for event in events:
        if not isinstance(event, dict):
            raise ValueError("FPL bootstrap events must contain objects")

        event_id = event.get("id")
        if type(event_id) is not int or event_id <= 0:
            raise ValueError("FPL event must have a positive integer id")

        if event_id in seen_ids:
            raise ValueError(f"Duplicate FPL event id: {event_id}")
        seen_ids.add(event_id)

        missing_fields = [field for field in EVENT_COLUMNS if field not in event]
        if missing_fields:
            raise ValueError(
                f"FPL event {event_id} is missing fields: "
                f"{', '.join(missing_fields)}"
            )

        if not isinstance(event["name"], str) or not event["name"].strip():
            raise ValueError(f"FPL event {event_id} has an invalid name")

        values = [event[field] for field in EVENT_COLUMNS]
        values[EVENT_COLUMNS.index("deadline_time")] = parse_event_timestamp(
            event["deadline_time"], event_id, "deadline_time"
        )
        values[EVENT_COLUMNS.index("release_time")] = parse_event_timestamp(
            event["release_time"], event_id, "release_time"
        )

        prepared.append((event_id, values, Json(event)))

    return prepared

def upsert(cursor, table, columns, rows, template=None, page_size=1000):
    updates = ", ".join(f"{c} = EXCLUDED.{c}" for c in columns if c != "id")
    execute_values(
        cursor,
        f"""
        INSERT INTO {table} ({", ".join(columns)}) VALUES %s
        ON CONFLICT (id) DO UPDATE SET {updates}
        """,
        rows,
        template=template,
        page_size=page_size
    )

class FPLSyncService:
    # Gets overall bootstrap data from the FPL API and updates teams, players and events in PostgreSQL database
    @staticmethod
    def sync_bootstrap_data(db):
        data = FPLClient.get_bootstrap_static()

        # Ensuring the response is a dictionary
        if not isinstance(data, dict):
            raise ValueError("FPL bootstrap response must be an object")

        # Split data, checking for errors
        try:
            teams_data = data["teams"]
            players_data = data["elements"]
            events_data = data["events"]
        except KeyError as exc:
            raise ValueError(
                f"FPL bootstrap response is missing required key: {exc.args[0]}"
            ) from exc

        validate_records(teams_data, "teams", TEAM_REQUIRED_KEYS)
        validate_records(players_data, "players", PLAYER_REQUIRED_KEYS)
        
        prepared_events = prepare_events(events_data)

        with db.cursor() as cursor:
            upsert(
                cursor,
                "teams",
                TEAM_COLUMNS,
                [tuple(t[c] for c in TEAM_COLUMNS) for t in teams_data],
            )

            upsert(
                cursor,
                "players",
                PLAYER_COLUMNS,
                [player_row(p) for p in players_data],
            )

            upsert(
                cursor,
                "events",
                EVENT_UPSERT_COLUMNS,
                [(*values, payload) for _, values, payload in prepared_events],
                template=EVENT_TEMPLATE
            )

            cursor.execute(
                "DELETE FROM events WHERE NOT (id = ANY(%s))",
                ([event_id for event_id, _, _ in prepared_events],),
            )