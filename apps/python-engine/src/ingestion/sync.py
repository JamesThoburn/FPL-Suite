from .fpl_client import FPLClient

class FPLSyncService:
    # Gets overrall bootstrap data from the FPL API and updates teams and players in PostgreSQL database
    @staticmethod
    def sync_bootstrap_data(db):
        data = FPLClient.get_bootstrap_static()

        # Ensuring the response is a dictionary
        if not isinstance(data, dict):
            raise ValueError("FPL bootstrap response must be an object")

        # Split into teams and players data, checking for errors
        try:
            teams_data = data["teams"]
            players_data = data["elements"]
        except KeyError as exc:
            raise ValueError(
                f"FPL bootstrap response is missing required key: {exc.args[0]}"
            ) from exc

        # Making sure the teams and players data are lists
        if not isinstance(teams_data, list) or not isinstance(players_data, list):
            raise ValueError("FPL bootstrap teams and elements must be lists")

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