import pytest
from unittest.mock import patch, Mock

from src.extract.extract_fpl_data import (
    _get_json,
    fetch_bootstrap,
    fetch_fixtures
)

# ----------
# _get_json
# ----------

@patch("src.extract.extract_fpl_data.requests.get")
def test_get_json_success(mock_get):
    mock_response = Mock() # Create a fake HTTP response object

    # Simulate a successful HTTP response
    mock_response.raise_for_status.return_value = None
    mock_response.json.return_value = {
        "hello": "world"
    }

    mock_get.return_value = mock_response # Configure requests.get() to return our fake response
    result = _get_json("https://example.com") # Call the function being tested
    assert result == {"hello": "world"} # Check that the returned result matches the fake JSON

# Test that _get_json returns ValueError when invalid JSON is returned
@patch("src.extract.extract_fpl_data.requests.get")
def test_get_json_invalid_json(mock_get):
    mock_response = Mock() # Create a fake HTTP response object

    # Simulate a successful HTTP response
    mock_response.raise_for_status.return_value = None
    mock_response.json.side_effect = ValueError(
        "Invalid JSON"
    )

    mock_get.return_value = mock_response # Configure requests.get() to return our fake response
    
    # Check that ValueError is raised
    with pytest.raises(ValueError):
        _get_json("https://example.com")

# ----------------
# fetch_bootstrap
# ----------------

# We mock get_json so fetch_bootstrap doesn't make a real API call
@patch("src.extract.extract_fpl_data._get_json")
def test_fetch_bootstrap_success(mock_get_json, monkeypatch):
    # Set temporary environment variable
    monkeypatch.setenv(
        "FPL_API_BASE_URL",
        "https://fantasy.premierleague.com/api" # No issue since this is a public API
    )

    # Create a fake API response
    mock_get_json.return_value = {
        "events": []
    }

    # Run function
    result = fetch_bootstrap()

    # Check the result against the expected result
    assert result == {"events": []}

# Test invalid response shape
@patch("src.extract.extract_fpl_data._get_json")
def test_fetch_bootstrap_invalid_shape(mock_get_json, monkeypatch):
    # Set temporary environment variable
    monkeypatch.setenv(
        "FPL_API_BASE_URL",
        "https://fantasy.premierleague.com/api" # No issue since this is a public API
    )

    # Create a fake API response (so no API call)
    mock_get_json.return_value = [] # Returns a list instead of a dict, we expect an error

    # Check that ValueError is raised
    with pytest.raises(ValueError):
        fetch_bootstrap()

# Test missing environment variable
def test_fetch_bootstrap_missing_env(monkeypatch):
    # Remove environment variable if it exists
    monkeypatch.delenv(
        "FPL_API_BASE_URL",
        raising=False
    )

    # Check that RuntimeError is raised
    with pytest.raises(RuntimeError):
        fetch_bootstrap()

# ---------------
# fetch_fixtures
# ---------------

# Test successful fixtures fetch
@patch("src.extract.extract_fpl_data._get_json")
def test_fetch_fixtures_success(mock_get_json, monkeypatch):
    # Set temporary environment variable
    monkeypatch.setenv(
        "FPL_API_BASE_URL",
        "https://fantasy.premierleague.com/api" # No issue since this is a public API
    )

    # Fixtures endpoint should return a list
    mock_get_json.return_value = []

    # Run function
    result = fetch_fixtures()

    # Check that result matches the expected result
    assert result == []

# Test invalid fixtures response shape
@patch("src.extract.extract_fpl_data._get_json")
def test_fetch_fixtures_invalid_shape(mock_get_json, monkeypatch):
    # Set temporary environment variable
    monkeypatch.setenv(
        "FPL_API_BASE_URL",
        "https://fantasy.premierleague.com/api"
    )

    # Returns a dict instead of a list, we expect an error
    mock_get_json.return_value = {}

    # Check that ValueError is raised
    with pytest.raises(ValueError):
        fetch_fixtures()

# Test missing environment variable
def test_fetch_fixtures_missing_env(monkeypatch):
    # Remove environment variable
    monkeypatch.delenv(
        "FPL_API_BASE_URL",
        raising=False
    )

    # Check that RuntimeError is raised
    with pytest.raises(RuntimeError):
        fetch_fixtures()