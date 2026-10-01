from unittest.mock import MagicMock, Mock, patch
import pytest
from src.ingestion.sync import FPLSyncService

@pytest.mark.parametrize(
	("response", "message"),
	[
		(None, "FPL bootstrap response must be an object"),
		([], "FPL bootstrap response must be an object"),
		({}, "FPL bootstrap response is missing required key: teams"),
		({"teams": []}, "FPL bootstrap response is missing required key: elements"),
		(
			{"teams": {}, "elements": []},
			"FPL bootstrap teams and elements must be lists",
		),
		(
			{"teams": [], "elements": {}},
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

	if response == {} or response == {"teams": []}:
		assert isinstance(exc_info.value.__cause__, KeyError)
	# Invalid payloads are rejected before the database is opened.
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
	team_context = MagicMock()
	team_context.__enter__.return_value = team_cursor
	player_context = MagicMock()
	player_context.__enter__.return_value = player_cursor
	db = Mock()
	db.cursor.side_effect = [team_context, player_context]
	response = {
		"teams": team_rows,
		"elements": [first_player, second_player],
	}

	with patch(
		"src.ingestion.sync.FPLClient.get_bootstrap_static", return_value=response
	):
		FPLSyncService.sync_bootstrap_data(db)

	# Teams and players are written in separate cursor contexts.
	assert db.cursor.call_count == 2
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
	}

	with patch(
		"src.ingestion.sync.FPLClient.get_bootstrap_static", return_value=response
	):
		with pytest.raises(RuntimeError, match="database unavailable"):
			FPLSyncService.sync_bootstrap_data(db)

	# Database execution failures propagate from the first team row.
	db.cursor.assert_called_once_with()
	team_cursor.execute.assert_called_once()