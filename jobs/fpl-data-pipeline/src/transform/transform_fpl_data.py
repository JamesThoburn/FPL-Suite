def transform_teams(raw_teams: list[dict]) -> list[dict]:
    teams = []
    for team in raw_teams:
        badge_code = team["code"] # Use the badge code to get logo_url
        teams.append({
            "id": team["id"],
            "name": team["name"],
            "short_name": team["short_name"],
            "logo_url": f"https://resources.premierleague.com/premierleague/badges/70/t{badge_code}.png"
        })
    return teams

def transform_gameweeks(raw_gameweeks: list[dict]) -> list[dict]:
    gameweeks = []
    for gw in raw_gameweeks:
        gameweeks.append({
            "id": gw["id"],
            "name": gw["name"],
            "deadline_time": gw["deadline_time"],
            "finished": gw["finished"],
            "is_previous": gw["is_previous"],
            "is_current": gw["is_current"],
            "is_next": gw["is_next"]
        })
    return gameweeks

# Map element_type (the id of the position) to the short-form position name
_POSITION_MAP = {1: "GKP", 2: "DEF", 3: "MID", 4: "FWD"}
def _map_position(element_type: int) -> str:
    if element_type not in _POSITION_MAP:
        raise ValueError(f"Unrecognised element_type: {element_type!r}")
    return _POSITION_MAP[element_type]

# Use a _to_float function to catch ValueError
def _to_float(value: str, field: str, player_id: int) -> float:
    try:
        return float(value)
    except (ValueError, TypeError) as exc:
        raise ValueError(
            f"Could not convert {field!r} to float for player {player_id!r}: {value!r}"
        ) from exc

def transform_players(raw_players: list[dict]) -> list[dict]:
    players = []
    for player in raw_players:
        players.append({
            "id": player["id"],
            "first_name": player["first_name"],
            "second_name": player["second_name"],
            "web_name": player["web_name"],
            "team_id": player["team"],
            "position": _map_position(player["element_type"]),
            "price": player["now_cost"] / 10, # £6.1 million is represented as 61 in bootstrap-static, this turns it into 6.1
            "ownership_percent": _to_float(player["selected_by_percent"], "selected_by_percent", player["id"]),
            "form": _to_float(player["form"], "form", player["id"]),
            "total_points": player["total_points"],
            "minutes": player["minutes"],
            "goals_scored": player["goals_scored"],
            "assists": player["assists"],
            "status": player["status"]
        })
    return players

def transform_fixtures(raw_fixtures: list[dict]) -> list[dict]:
    fixtures = []
    for fixture in raw_fixtures:
        fixtures.append({
            "id": fixture["id"],
            "gameweek_id": fixture["event"], # Might need to check for unscheduled/postponed fixtures in the future (when they become available)
            "home_team_id": fixture["team_h"],
            "away_team_id": fixture["team_a"],
            "home_difficulty": fixture["team_h_difficulty"],
            "away_difficulty": fixture["team_a_difficulty"]
        })
    return fixtures