import psycopg2
import os
from psycopg2.extras import execute_values

def get_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

def upsert_teams(teams: list[dict]) -> None:
    sql = """
        INSERT INTO teams (id, name, short_name, logo_url)
        VALUES %s
        ON CONFLICT (id) DO UPDATE
            SET name = EXCLUDED.name,
                short_name = EXCLUDED.short_name,
                logo_url = EXCLUDED.logo_url
    """
    values = [(
        t["id"], t["name"], t["short_name"], t["logo_url"]
    ) for t in teams]

    with get_connection() as conn:
        with conn.cursor() as cur:
            execute_values(cur, sql, values)

def upsert_gameweeks(gameweeks: list[dict]) -> None:
    sql = """
        INSERT INTO gameweeks (id, name, deadline_time, finished, is_previous, is_current, is_next)
        VALUES %s
        ON CONFLICT (id) DO UPDATE
            SET name = EXCLUDED.name,
                deadline_time = EXCLUDED.deadline_time,
                finished = EXCLUDED.finished,
                is_previous = EXCLUDED.is_previous,
                is_current = EXCLUDED.is_current,
                is_next = EXCLUDED.is_next
    """
    values = [(
        gw["id"], gw["name"], gw["deadline_time"], gw["finished"], gw["is_previous"], gw["is_current"], gw["is_next"]
    ) for gw in gameweeks]

    with get_connection() as conn:
        with conn.cursor() as cur:
            execute_values(cur, sql, values)

def upsert_players(players: list[dict]) -> None:
    sql = """
        INSERT INTO players (id, first_name, second_name, web_name, team_id, position, price, ownership_percent, form, total_points, minutes, goals_scored, assists, status)
        VALUES %s
        ON CONFLICT (id) DO UPDATE
            SET first_name = EXCLUDED.first_name,
                second_name = EXCLUDED.second_name,
                web_name = EXCLUDED.web_name,
                team_id = EXCLUDED.team_id,
                position = EXCLUDED.position,
                price = EXCLUDED.price,
                ownership_percent = EXCLUDED.ownership_percent,
                form = EXCLUDED.form,
                total_points = EXCLUDED.total_points,
                minutes = EXCLUDED.minutes,
                goals_scored = EXCLUDED.goals_scored,
                assists = EXCLUDED.assists,
                status = EXCLUDED.status
    """
    values = [(
        p["id"], p["first_name"], p["second_name"], p["web_name"], p["team_id"], p["position"], p["price"], p["ownership_percent"], p["form"], p["total_points"], p["minutes"], p["goals_scored"], p["assists"], p["status"]
    ) for p in players]

    with get_connection() as conn:
        with conn.cursor() as cur:
            execute_values(cur, sql, values)

def upsert_fixtures(fixtures: list[dict]) -> None:
    sql = """
        INSERT INTO fixtures (id, gameweek_id, home_team_id, away_team_id, home_difficulty, away_difficulty)
        VALUES %s
        ON CONFLICT (id) DO UPDATE
            SET gameweek_id = EXCLUDED.gameweek_id,
                home_team_id = EXCLUDED.home_team_id,
                away_team_id = EXCLUDED.away_team_id,
                home_difficulty = EXCLUDED.home_difficulty,
                away_difficulty = EXCLUDED.away_difficulty
    """
    values = [(
        f["id"], f["gameweek_id"], f["home_team_id"], f["away_team_id"], f["home_difficulty"], f["away_difficulty"]
    ) for f in fixtures]

    with get_connection() as conn:
        with conn.cursor() as cur:
            execute_values(cur, sql, values)