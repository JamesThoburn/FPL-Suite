from datetime import datetime, timezone
from unittest.mock import MagicMock, Mock, patch

import pytest
from src.ingestion.sync import EVENT_COLUMNS, FPLSyncService

def make_event(event_id=1):
	return {
        "id": event_id,
        "name": f"Gameweek {event_id}",
        "deadline_time": "2026-08-21T17:30:00Z",
        "release_time": None,
        "average_entry_score": 50,
        "finished": False,
        "data_checked": False,
        "highest_scoring_entry": None,
        "deadline_time_epoch": 1787333400,
        "deadline_time_game_offset": 0,
        "highest_score": None,
        "transfers_made": 0,
        "is_previous": False,
        "is_current": event_id == 1,
        "is_next": False,
        "cup_leagues_created": False,
        "h2h_ko_matches_created": False,
        "can_enter": False,
        "can_manage": False,
        "most_selected": None,
        "most_transferred_in": None,
        "top_element": None,
        "most_captained": None,
        "most_vice_captained": None,
        "chip_plays": [],
        "overrides": {"rules": {}, "scoring": {}},
        "top_element_info": {"id": 115, "points": 17},
    }

def make_cursor_context(cursor):
	context = MagicMock()
	context.__enter__.return_value = cursor
	return context

@pytest.mark.parametrize(
	("response", "message"),
	[
		(None, "FPL bootstrap response must be an object"),
		([], "FPL bootstrap response must be an object"),
		({}, "FPL bootstrap response is missing required key: teams"),
		({"teams": []}, "FPL bootstrap response is missing required key: elements"),
		(
			{"teams": [], "elements": []},
			"FPL bootstrap response is missing required key: events",
		),
		(
			{"teams": {}, "elements": [], "events": [make_event()]},
			"FPL bootstrap teams and elements must be lists",
		),
		(
			{"teams": [], "elements": {}, "events": [make_event()]},
			"FPL bootstrap teams and elements must be lists",
		),
	],
)
def test_sync_bootstrap_data_rejects_invalid_response(response, message):
	db = Mock()

	with patch(
		"src.ingestion.sync.FPLClient.get_bootstrap_static", return_value=response
	):
		with pytest.raises(ValueError, match=message) as exc_info:
			FPLSyncService.sync_bootstrap_data(db)

	if response in ({}, {"teams": []}, {"teams": [], "elements": []}):
		assert isinstance(exc_info.value.__cause__, KeyError)
	# Invalid payloads are rejected before the database is opened.
	db.cursor.assert_not_called()

@pytest.mark.parametrize(
	("events", "message"),
	[
		(None, "FPL bootstrap events must be a non-empty list"),
		([], "FPL bootstrap events must be a non-empty list"),
		({}, "FPL bootstrap events must be a non-empty list"),
		([None], "FPL bootstrap events must contain objects"),
		(
			[{**make_event(), "id": 0}],
			"FPL event must have a positive integer id",
		),
		(
			[make_event(), make_event()],
			"Duplicate FPL event id: 1",
		),
		(
			[{key: value for key, value in make_event().items() if key != "name"}],
			"FPL event 1 is missing fields: name",
		),
		(
			[{**make_event(), "name": " "}],
			"FPL event 1 has an invalid name",
		),
		(
			[{**make_event(), "deadline_time": "not-a-date"}],
			"FPL event 1 has an invalid deadline_time",
		),
		(
			[{**make_event(), "deadline_time": "2026-08-21T17:30:00"}],
			"FPL event 1 deadline_time must include a timezone",
		),
		(
			[{**make_event(), "release_time": "not-a-date"}],
			"FPL event 1 has an invalid release_time",
		),
	],
)
def test_sync_bootstrap_data_rejects_invalid_events(events, message):
	db = Mock()
	response = {
		"teams": [],
		"elements": [],
		"events": events,
	}

	with patch(
		"src.ingestion.sync.FPLClient.get_bootstrap_static", return_value=response
	):
		with pytest.raises(ValueError, match=message):
			FPLSyncService.sync_bootstrap_data(db)

	db.cursor.assert_not_called()

def test_sync_bootstrap_data_writes_teams_and_players():
	team_rows = [
		{"id": 1, "name": "Arsenal", "short_name": "ARS", "position": 1, "code": 3},
		{"id": 2, "name": "Villa", "short_name": "AVL", "position": 2, "code": 7},
	]
	first_player = {
		"id": 10,
		"code": 100,
		"first_name": "Alex",
		"second_name": "Example",
		"web_name": "Alex",
		"element_type": 3,
		"team": 1,
		"now_cost": 75,
		"status": "a",
		"total_points": 50,
		"chance_of_playing_next_round": 100,
		"news": "",
		"form": "5.0",
		"selected_by_percent": "10.0",
		"minutes": 900,
		"goals_scored": 5,
		"assists": 2,
		"clean_sheets": 3,
		"goals_conceded": 8,
		"own_goals": 0,
		"penalties_saved": 0,
		"penalties_missed": 0,
		"yellow_cards": 1,
		"red_cards": 0,
		"saves": 0,
		"bonus": 7,
		"bps": 120,
		"expected_goals": "4.5",
		"expected_assists": "1.8",
		"expected_goal_involvements": "6.3",
		"expected_goals_conceded": "9.0",
	}
	second_player = {
		"id": 11,
		"code": 101,
		"first_name": "Jamie",
		"second_name": "Sample",
		"web_name": "Jamie",
		"element_type": 2,
		"team": 2,
		"now_cost": 50,
		"status": "d",
		"total_points": 12,
	}
	team_cursor = Mock()
	player_cursor = Mock()
	event_cursor = Mock()
	team_context = MagicMock()
	team_context.__enter__.return_value = team_cursor
	player_context = MagicMock()
	player_context.__enter__.return_value = player_cursor
	event_context = MagicMock()
	event_context.__enter__.return_value = event_cursor
	db = Mock()
	db.cursor.side_effect = [team_context, player_context, event_context]
	event = make_event()
	event.update(
		{
			"most_selected": 10,
			"top_element": 11,
			"chip_plays": [{"chip_name": "wildcard", "num_played": 12}],
		}
	)
	response = {
		"teams": team_rows,
		"elements": [first_player, second_player],
		"events": [event],
	}

	with patch(
		"src.ingestion.sync.FPLClient.get_bootstrap_static", return_value=response
	):
		FPLSyncService.sync_bootstrap_data(db)

	# Teams, players, and events are written in separate cursor contexts.
	assert db.cursor.call_count == 3
	assert [execute_call.args[1] for execute_call in team_cursor.execute.call_args_list] == [
		(1, "Arsenal", "ARS", 1, 3),
		(2, "Villa", "AVL", 2, 7),
	]
	assert "INSERT INTO teams" in team_cursor.execute.call_args.args[0]
	assert len(player_cursor.execute.call_args_list) == 2

	first_player_params = player_cursor.execute.call_args_list[0].args[1]
	assert first_player_params == (
		10, 100, "Alex", "Example", "Alex", 3, 1, 75, "a", 100, "", 50,
		"5.0", "10.0", 900, 5, 2, 3, 8, 0, 0, 0, 1, 0, 0, 7, 120,
		"4.5", "1.8", "6.3", "9.0",
	)
	# Missing optional FPL fields are bound as SQL NULL values.
	second_player_params = player_cursor.execute.call_args_list[1].args[1]
	assert second_player_params[:9] == (11, 101, "Jamie", "Sample", "Jamie", 2, 2, 50, "d")
	assert second_player_params[9:11] == (None, None)
	assert second_player_params[12:] == (None,) * 19
	assert "INSERT INTO players" in player_cursor.execute.call_args.args[0]

	event_sql, event_params = event_cursor.execute.call_args_list[0].args
	assert "INSERT INTO events" in event_sql
	assert "ON CONFLICT (id) DO UPDATE" in event_sql
	assert event_sql.count("%s") == len(event_params)
	assert len(event_params) == len(EVENT_COLUMNS) + 1
	assert event_params[EVENT_COLUMNS.index("id")] == 1
	assert event_params[EVENT_COLUMNS.index("deadline_time")] == datetime(
		2026, 8, 21, 17, 30, tzinfo=timezone.utc
	)
	assert event_params[EVENT_COLUMNS.index("release_time")] is None
	assert event_params[EVENT_COLUMNS.index("most_selected")] == 10
	assert event_params[-1].adapted == event
	delete_sql, delete_params = event_cursor.execute.call_args_list[1].args
	assert "DELETE FROM events" in delete_sql
	assert delete_params == ([1],)

def test_sync_bootstrap_data_propagates_fetch_errors():
	db = Mock()
	fetch_error = RuntimeError("FPL API unavailable")

	with patch(
		"src.ingestion.sync.FPLClient.get_bootstrap_static", side_effect=fetch_error
	):
		with pytest.raises(RuntimeError, match="FPL API unavailable") as exc_info:
			FPLSyncService.sync_bootstrap_data(db)

	# Client failures propagate without opening a database cursor.
	assert exc_info.value is fetch_error
	db.cursor.assert_not_called()

def test_sync_bootstrap_data_propagates_database_errors():
	team_cursor = Mock()
	team_cursor.execute.side_effect = RuntimeError("database unavailable")
	team_context = MagicMock()
	team_context.__enter__.return_value = team_cursor
	db = Mock()
	db.cursor.return_value = team_context
	response = {
		"teams": [
			{"id": 1, "name": "Arsenal", "short_name": "ARS", "position": 1, "code": 3}
		],
		"elements": [],
		"events": [make_event()],
	}

	with patch(
		"src.ingestion.sync.FPLClient.get_bootstrap_static", return_value=response
	):
		with pytest.raises(RuntimeError, match="database unavailable"):
			FPLSyncService.sync_bootstrap_data(db)

	# Database execution failures propagate from the first team row.
	db.cursor.assert_called_once_with()
	team_cursor.execute.assert_called_once()