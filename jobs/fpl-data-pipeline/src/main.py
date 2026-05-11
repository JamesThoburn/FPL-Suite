import logging

from extract.extract_fpl_data import fetch_bootstrap, fetch_fixtures

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

logging.info("Fetching bootstrap data...")
bootstrap = fetch_bootstrap()

logging.info("Fetching fixtures...")
raw_fixtures = fetch_fixtures()



logging.info("Pipeline complete")