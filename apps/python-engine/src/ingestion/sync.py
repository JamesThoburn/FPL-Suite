from datetime import datetime, timezone
from psycopg2.extras import Json

from .fpl_client import FPLClient

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

class FPLSyncService:
    # Gets overrall bootstrap data from the FPL API and updates teams and players in PostgreSQL database
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

        # Making sure the teams and players data are lists
        if not isinstance(teams_data, list) or not isinstance(players_data, list):
            raise ValueError("FPL bootstrap teams and elements must be lists")

        prepared_events = prepare_events(events_data)

        # Update teams in the database
        with db.cursor() as cursor:
            for team in teams_data:
                cursor.execute(
                    """
                    INSERT INTO teams (id, name, short_name, position, code)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        short_name = EXCLUDED.short_name,
                        position = EXCLUDED.position,
                        code = EXCLUDED.code;
                    """,
                    (team["id"], team["name"], team["short_name"], team["position"], team["code"]),
                )

        # Update players in the database
        with db.cursor() as cursor:
            for player in players_data:
                cursor.execute(
                    """
                    INSERT INTO players (id, code, first_name, second_name, web_name, element_type_id, team_id, now_cost, status, chance_of_playing_next_round, news, total_points, form, selected_by_percent, minutes, goals_scored, assists, clean_sheets, goals_conceded, own_goals, penalties_saved, penalties_missed, yellow_cards, red_cards, saves, bonus, bps, expected_goals, expected_assists, expected_goal_involvements, expected_goals_conceded)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        code = EXCLUDED.code,
                        first_name = EXCLUDED.first_name,
                        second_name = EXCLUDED.second_name,
                        web_name = EXCLUDED.web_name,
                        element_type_id = EXCLUDED.element_type_id,
                        team_id = EXCLUDED.team_id,
                        now_cost = EXCLUDED.now_cost,
                        status = EXCLUDED.status,
                        chance_of_playing_next_round = EXCLUDED.chance_of_playing_next_round,
                        news = EXCLUDED.news,
                        total_points = EXCLUDED.total_points,
                        form = EXCLUDED.form,
                        selected_by_percent = EXCLUDED.selected_by_percent,
                        minutes = EXCLUDED.minutes,
                        goals_scored = EXCLUDED.goals_scored,
                        assists = EXCLUDED.assists,
                        clean_sheets = EXCLUDED.clean_sheets,
                        goals_conceded = EXCLUDED.goals_conceded,
                        own_goals = EXCLUDED.own_goals,
                        penalties_saved = EXCLUDED.penalties_saved,
                        penalties_missed = EXCLUDED.penalties_missed,
                        yellow_cards = EXCLUDED.yellow_cards,
                        red_cards = EXCLUDED.red_cards,
                        saves = EXCLUDED.saves,
                        bonus = EXCLUDED.bonus,
                        bps = EXCLUDED.bps,
                        expected_goals = EXCLUDED.expected_goals,
                        expected_assists = EXCLUDED.expected_assists,
                        expected_goal_involvements = EXCLUDED.expected_goal_involvements,
                        expected_goals_conceded = EXCLUDED.expected_goals_conceded;
                    """,
                    (player["id"], player["code"], player["first_name"], player["second_name"], player["web_name"], player["element_type"], player["team"], player["now_cost"], player["status"], player.get("chance_of_playing_next_round"), player.get("news"), player["total_points"], player.get("form"), player.get("selected_by_percent"), player.get("minutes"), player.get("goals_scored"), player.get("assists"), player.get("clean_sheets"), player.get("goals_conceded"), player.get("own_goals"), player.get("penalties_saved"), player.get("penalties_missed"), player.get("yellow_cards"), player.get("red_cards"), player.get("saves"), player.get("bonus"), player.get("bps"), player.get("expected_goals"), player.get("expected_assists"), player.get("expected_goal_involvements"), player.get("expected_goals_conceded")),
                )

        # Events
        event_columns_sql = ", ".join(EVENT_COLUMNS)
        event_placeholders_sql = ", ".join(["%s"] * len(EVENT_COLUMNS))
        event_updates_sql = ", ".join(
            f"{column} = EXCLUDED.{column}"
            for column in EVENT_COLUMNS
            if column != "id"
        )

        upsert_event_sql = f"""
            INSERT INTO events (
                {event_columns_sql},
                payload,
                synced_at
            )
            VALUES (
                {event_placeholders_sql},
                %s,
                now()
            )
            ON CONFLICT (id) DO UPDATE SET
                {event_updates_sql},
                payload = EXCLUDED.payload,
                synced_at = now()
        """

        event_ids = [event_id for event_id, _, _ in prepared_events]

        with db.cursor() as cursor:
            for _, values, payload in prepared_events:
                cursor.execute(upsert_event_sql, (*values, payload))

            cursor.execute(
                "DELETE FROM events WHERE NOT (id = ANY(%s))",
                (event_ids,),
            )