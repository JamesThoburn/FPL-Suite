import pytest

from src.transform.transform_fpl_data import (
    transform_teams,
    transform_gameweeks,
    transform_players,
    transform_fixtures,
    _map_position,
    _to_float
)

# ----------------
# transform_teams
# ----------------

# Test successful team transformation
def test_transform_teams_success():
    raw_teams = [
        {
            "id": 1,
            "name": "Arsenal",
            "short_name": "ARS",
            "code": "3"
        }
    ]

    result = transform_teams(raw_teams)

    assert result == [
        {
            "id": 1,
            "name": "Arsenal",
            "short_name": "ARS",
            "logo_url": "https://resources.premierleague.com/premierleague/badges/70/t3.png"
        }
    ]

# Test missing team code
def test_transform_teams_missing_code():
    raw_teams = [
        {
            "id": 1,
            "name": "Arsenal",
            "short_name": "ARS"
        }
    ]

    with pytest.raises(KeyError):
        transform_teams(raw_teams)

# --------------------
# transform_gameweeks
# --------------------

# Test successful gameweek transformation
def test_transform_gameweek_success():
    raw_gameweeks = [
        {
            "id": 1,
            "name": "Gameweek 1",
            "deadline_time": "2025-08-15T17:30:00Z",
            "finished": False,
            "is_previous": False, # are these stored as boolean???
            "is_current": True,
            "is_next": False
        }
    ]

    result = transform_gameweeks(raw_gameweeks)

    assert result == [
        {
            "id": 1,
            "name": "Gameweek 1",
            "deadline_time": "2025-08-15T17:30:00Z",
            "finished": False,
            "is_previous": False,
            "is_current": True,
            "is_next": False
        }
    ]

# --------------
# _map_position
# --------------

# Test valid position mapping
@pytest.mark.parametrize(
    "element_type,expected",
    [
        (1, "GKP"),
        (2, "DEF"),
        (3, "MID"),
        (4, "FWD")
    ]
)
def test_map_position_valid(element_type, expected):
    assert _map_position(element_type) == expected

# Test invalid position mapping
def test_map_position_invalid():
    with pytest.raises(ValueError, match="Unrecognised element_type"):
        _map_position(99)

# ----------
# _to_float
# ----------

# Test successful float conversion
def test_to_float_success():
    result = _to_float("12.5", "form", 1)
    assert result == 12.5

# Test invalid float conversion
@pytest.mark.parametrize("value", ["abc", None, ""])
def test_to_float_invalid(value):
    with pytest.raises(ValueError):
        _to_float(value, "form", 1)

# ------------------
# transform_players
# ------------------

# Test successful player transformation
def test_transform_players_success():
    raw_players = [
        {
            "id": 101,
            "first_name": "Bukayo",
            "second_name": "Saka",
            "web_name": "Saka",
            "team": 1,
            "element_type": 3,
            "now_cost": 101,
            "selected_by_percent": "11.4",
            "form": "3.5",
            "total_points": 147,
            "minutes": 2128,
            "goals_scored": 7,
            "assists": 9,
            "status": "a"
        }
    ]

    result = transform_players(raw_players)

    assert result == [
        {
            "id": 101,
            "first_name": "Bukayo",
            "second_name": "Saka",
            "web_name": "Saka",
            "team_id": 1,
            "position": "MID",
            "price": 10.1,
            "ownership_percent": 11.4,
            "form": 3.5,
            "total_points": 147,
            "minutes": 2128,
            "goals_scored": 7,
            "assists": 9,
            "status": "a"
        }
    ]

# Test invalid player position
def test_transform_players_invalid_position():
    raw_players = [
        {
            "id": 101,
            "first_name": "Bukayo",
            "second_name": "Saka",
            "web_name": "Saka",
            "team": 1,
            "element_type": 9999999,
            "now_cost": 101,
            "selected_by_percent": "11.4",
            "form": "3.5",
            "total_points": 147,
            "minutes": 2128,
            "goals_scored": 7,
            "assists": 9,
            "status": "a"
        }
    ]

    with pytest.raises(ValueError):
        transform_players(raw_players)

# Test invalid float conversion
def test_transform_players_invalid_float():
    raw_players = [
        {
            "id": 101,
            "first_name": "Bukayo",
            "second_name": "Saka",
            "web_name": "Saka",
            "team": 1,
            "element_type": 3,
            "now_cost": 101,
            "selected_by_percent": "invalid float",
            "form": "3.5",
            "total_points": 147,
            "minutes": 2128,
            "goals_scored": 7,
            "assists": 9,
            "status": "a"
        }
    ]

    with pytest.raises(ValueError):
        transform_players(raw_players)

# -------------------
# transform_fixtures
# -------------------

# Test successful fixture transformation
def test_transform_fixtures_success():
    raw_fixtures = [
        {
            "id": 500,
            "event": 1,
            "team_h": 1,
            "team_a": 2,
            "team_h_difficulty": 3,
            "team_a_difficulty": 4
        }
    ]

    result = transform_fixtures(raw_fixtures)

    assert result == [
        {
            "id": 500,
            "gameweek_id": 1,
            "home_team_id": 1,
            "away_team_id": 2,
            "home_difficulty": 3,
            "away_difficulty": 4
        }
    ]