import requests
import logging

logger = logging.getLogger(__name__)

class FPLClient:
    BASE_URL="https://fantasy.premierleague.com/api/"
    REQUEST_TIMEOUT = (5, 30)

    # A general method to make GET requests to the FPL API and handle errors. Done this way for modularity
    @classmethod
    def _get(cls, endpoint: str) -> dict:
        url = f"{cls.BASE_URL}{endpoint}"
        try:
            response = requests.get(url, timeout=cls.REQUEST_TIMEOUT)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to fetch data from FPL API ({url}): {e}")
            raise

    # Fetches the core data from the FPL API: players, teams, gameweeks, positions, etc.
    @classmethod
    def get_bootstrap_static(cls) -> dict:
        return cls._get("/bootstrap-static/")

    # Fetches all Premier League fixtures and their difficulties
    @classmethod
    def get_fixtures(cls) -> list:
        return cls._get("/fixtures/")

    # Fetches live data for a specific gameweek, including player stats and live scores
    @classmethod
    def get_live_gameweek(cls, event_id: int) -> dict:
        return cls._get(f"/event/{event_id}/live/")

    # Fetches detailed information about a specific player
    @classmethod
    def get_player_summary(cls, player_id: int) -> dict:
        return cls._get(f"/element-summary/{player_id}")