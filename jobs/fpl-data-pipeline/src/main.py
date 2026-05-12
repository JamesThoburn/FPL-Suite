import logging

from extract.extract_fpl_data import fetch_bootstrap, fetch_fixtures
from transform.transform_fpl_data import transform_teams, transform_gameweeks, transform_players, transform_fixtures

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

# Extract
logging.info("Fetching bootstrap data...")
bootstrap = fetch_bootstrap()
logging.info("Fetching fixtures...")
raw_fixtures = fetch_fixtures()

# Transform
logging.info("Transforming Teams...")
teams = transform_teams(bootstrap["teams"])
logging.info("Transforming Gameweeks...")
gameweeks = transform_gameweeks(bootstrap["events"])
logging.info("Transforming Players...")
players = transform_players(bootstrap["elements"])
logging.info("Transforming Fixtures")
fixtures = transform_fixtures(raw_fixtures)

logging.info(f"Transformed {len(teams)} teams, {len(gameweeks)} gameweeks, {len(players)} players and {len(fixtures)} fixtures")

logging.info("Pipeline complete")