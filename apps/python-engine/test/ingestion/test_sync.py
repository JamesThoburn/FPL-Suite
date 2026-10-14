from datetime import datetime, timezone
from unittest.mock import MagicMock, Mock, patch

import pytest
from src.ingestion.sync import (
	EVENT_COLUMNS,
	EVENT_TEMPLATE,
	EVENT_UPSERT_COLUMNS,
	PLAYER_COLUMNS,
	FPLSyncService,
)

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

def make_team(team_id=1):
	return {
		"id": team_id,
		"name": f"Team {team_id}",
		"short_name": f"T{team_id}",
		"position": team_id,
		"code": team_id * 10,
	}

def make_player(player_id=10):
	# Only the required fields; optional FPL fields are deliberately absent.
	return {
		"id": player_id,
		"code": 100 + player_id,
		"first_name": "Alex",
		"second_name": "Example",
		"web_name": "Alex",
		"element_type": 3,
		"team": 1,
		"now_cost": 75,
		"status": "a",
		"total_points": 50,
	}

def make_response(**overrides):
	response = {
		"teams": [make_team()],
		"elements": [make_player()],
		"events": [make_event()],
	}
	response.update(overrides)
	return response

def without(record, key):
	return {k: v for k, v in record.items() if k != key}

def make_cursor_context(cursor):
	context = MagicMock()
	context.__enter__.return_value = cursor
	return context

def assert_rejected(response, message):
	db = Mock()

	with patch(
		"src.ingestion.sync.FPLClient.get_bootstrap_static", return_value=response
	):
		with pytest.raises(ValueError, match=message):
			FPLSyncService.sync_bootstrap_data(db)

	# Invalid payloads are rejected before any database cursor is opened.
	db.cursor.assert_not_called()

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
	db.cursor.assert_not_called()

@pytest.mark.parametrize(
	("teams", "message"),
	[
		(None, "FPL bootstrap teams must be a non-empty list"),
		([], "FPL bootstrap teams must be a non-empty list"),
		({}, "FPL bootstrap teams must be a non-empty list"),
		([None], "FPL bootstrap teams must contain objects"),
		([{**make_team(), "id": 0}], "FPL teams entry must have a positive integer id"),
		([make_team(), make_team()], "Duplicate FPL teams id: 1"),
		([without(make_team(), "name")], "FPL teams 1 is missing fields: name"),
	],
)
def test_sync_bootstrap_data_rejects_invalid_teams(teams, message):
	assert_rejected(make_response(teams=teams), message)

@pytest.mark.parametrize(
	("players", "message"),
	[
		(None, "FPL bootstrap players must be a non-empty list"),
		([], "FPL bootstrap players must be a non-empty list"),
		({}, "FPL bootstrap players must be a non-empty list"),
		([None], "FPL bootstrap players must contain objects"),
		([{**make_player(), "id": 0}], "FPL players entry must have a positive integer id"),
		([make_player(), make_player()], "Duplicate FPL players id: 10"),
		([without(make_player(), "web_name")], "FPL players 10 is missing fields: web_name"),
	],
)
def test_sync_bootstrap_data_rejects_invalid_players(players, message):
	assert_rejected(make_response(elements=players), message)

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
			[without(make_event(), "name")],
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
	assert_rejected(make_response(events=events), message)

def test_sync_bootstrap_data_writes_teams_players_and_events():
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
	cursor = Mock()
	db = Mock()
	db.cursor.return_value = make_cursor_context(cursor)

	with (
		patch("src.ingestion.sync.FPLClient.get_bootstrap_static", return_value=response),
		patch("src.ingestion.sync.execute_values") as execute_values,
	):
		FPLSyncService.sync_bootstrap_data(db)

	# One cursor covers every write, so they share a single transaction scope.
	db.cursor.assert_called_once_with()
	assert execute_values.call_count == 3
	teams_call, players_call, events_call = execute_values.call_args_list

	for write in (teams_call, players_call, events_call):
		assert write.args[0] is cursor
		assert "ON CONFLICT (id) DO UPDATE SET" in write.args[1]
		assert write.kwargs["page_size"] == 1000

	# Teams
	assert "INSERT INTO teams (id, name, short_name, position, code)" in teams_call.args[1]
	assert teams_call.args[2] == [
		(1, "Arsenal", "ARS", 1, 3),
		(2, "Villa", "AVL", 2, 7),
	]
	assert teams_call.kwargs["template"] is None

	# Players
	assert f"INSERT INTO players ({', '.join(PLAYER_COLUMNS)})" in players_call.args[1]
	first_row, second_row = players_call.args[2]
	assert first_row == (
		10, 100, "Alex", "Example", "Alex", 3, 1, 75, "a", 50,
		100, "", "5.0", "10.0", 900, 5, 2, 3, 8, 0, 0, 0, 1, 0, 0, 7, 120,
		"4.5", "1.8", "6.3", "9.0",
	)
	# Missing optional FPL fields are bound as SQL NULL values (10 columns are required).
	assert second_row == (11, 101, "Jamie", "Sample", "Jamie", 2, 2, 50, "d", 12) + (
		None,
	) * (len(PLAYER_COLUMNS) - 10)
	assert len(first_row) == len(second_row) == len(PLAYER_COLUMNS)

	# Events
	assert f"INSERT INTO events ({', '.join(EVENT_UPSERT_COLUMNS)})" in events_call.args[1]
	assert "synced_at = EXCLUDED.synced_at" in events_call.args[1]
	assert events_call.kwargs["template"] == EVENT_TEMPLATE
	(row,) = events_call.args[2]
	# synced_at comes from now() in the template, so it has no placeholder.
	assert events_call.kwargs["template"].count("%s") == len(row)
	assert len(row) == len(EVENT_UPSERT_COLUMNS) - 1
	assert row[EVENT_COLUMNS.index("id")] == 1
	assert row[EVENT_COLUMNS.index("deadline_time")] == datetime(
		2026, 8, 21, 17, 30, tzinfo=timezone.utc
	)
	assert row[EVENT_COLUMNS.index("release_time")] is None
	assert row[EVENT_COLUMNS.index("most_selected")] == 10
	assert row[-1].adapted == event

	# The only direct execute is the DELETE of events missing from the response.
	cursor.execute.assert_called_once()
	delete_sql, delete_params = cursor.execute.call_args.args
	assert "DELETE FROM events" in delete_sql
	assert delete_params == ([1],)

def test_sync_bootstrap_data_writes_in_foreign_key_order():
	order = []
	cursor = Mock()
	cursor.execute.side_effect = lambda sql, params: order.append("delete")
	db = Mock()
	db.cursor.return_value = make_cursor_context(cursor)

	def record_upsert(_cursor, sql, rows, **kwargs):
		# The table name is the third token of "INSERT INTO <table> (...)".
		order.append(sql.split()[2])

	with (
		patch(
			"src.ingestion.sync.FPLClient.get_bootstrap_static",
			return_value=make_response(),
		),
		patch("src.ingestion.sync.execute_values", side_effect=record_upsert),
	):
		FPLSyncService.sync_bootstrap_data(db)

	# Events reference players, and the DELETE must follow the events upsert.
	assert order == ["teams", "players", "events", "delete"]

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
	cursor = Mock()
	db = Mock()
	db.cursor.return_value = make_cursor_context(cursor)
	database_error = RuntimeError("database unavailable")

	with (
		patch(
			"src.ingestion.sync.FPLClient.get_bootstrap_static",
			return_value=make_response(),
		),
		patch(
			"src.ingestion.sync.execute_values", side_effect=database_error
		) as execute_values,
	):
		with pytest.raises(RuntimeError, match="database unavailable") as exc_info:
			FPLSyncService.sync_bootstrap_data(db)

	# The teams upsert fails first, so nothing after it runs.
	assert exc_info.value is database_error
	execute_values.assert_called_once()
	cursor.execute.assert_not_called()