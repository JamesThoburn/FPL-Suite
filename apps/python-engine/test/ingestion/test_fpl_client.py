from unittest.mock import Mock, patch
import pytest
import requests
from src.ingestion.fpl_client import FPLClient

def test_get_returns_json_after_successful_request():
	response_data = {"teams": [{"id": 1}]}
	response = Mock()
	response.json.return_value = response_data

	# Mock the transport so the unit test never calls the live FPL API.
	with patch("src.ingestion.fpl_client.requests.get", return_value=response) as get:
		result = FPLClient._get("fixtures/")

	assert result == response_data
	get.assert_called_once_with(
		"https://fantasy.premierleague.com/api/fixtures/", timeout=(5, 30)
	)
	response.raise_for_status.assert_called_once_with()
	response.json.assert_called_once_with()

@pytest.mark.parametrize("failure_stage", ["request", "status", "json"])
def test_get_logs_and_reraises_request_exceptions(failure_stage):
	url = "https://fantasy.premierleague.com/api/bootstrap-static/"
	request_error = requests.exceptions.RequestException("request failed")
	response = Mock()
	get_options = {"return_value": response}
	if failure_stage == "request":
		get_options = {"side_effect": request_error}
	elif failure_stage == "status":
		response.raise_for_status.side_effect = request_error
	else:
		response.json.side_effect = request_error

	# Each RequestException path is logged once and preserves the original error.
	with (
		patch("src.ingestion.fpl_client.requests.get", **get_options),
		patch("src.ingestion.fpl_client.logger.error") as log_error,
	):
		with pytest.raises(requests.exceptions.RequestException) as exc_info:
			FPLClient._get("bootstrap-static/")

	assert exc_info.value is request_error
	log_error.assert_called_once_with(
		f"Failed to fetch data from FPL API ({url}): {request_error}"
	)
	assert response.json.call_count == int(failure_stage == "json")

@pytest.mark.parametrize(
	("method_name", "args", "endpoint"),
	[
		("get_bootstrap_static", (), "/bootstrap-static/"),
		("get_fixtures", (), "/fixtures/"),
		("get_live_gameweek", (8,), "/event/8/live/"),
		("get_player_summary", (42,), "/element-summary/42"),
	],
)
def test_endpoint_helpers_request_the_expected_endpoint(method_name, args, endpoint):
	response_data = {"result": "ok"}

	with patch.object(FPLClient, "_get", return_value=response_data) as get:
		result = getattr(FPLClient, method_name)(*args)

	assert result == response_data
	get.assert_called_once_with(endpoint)