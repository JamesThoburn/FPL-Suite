from database import get_db_connection
from ingestion.sync import FPLSyncService
import logging
import time

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(message)s"
)

def run_worker():
    with get_db_connection() as db:
        FPLSyncService.sync_bootstrap_data(db)

if __name__ == "__main__":
    start = time.time()
    run_worker()
    end = time.time()
    elapsed = end - start
    logging.info(f"Task completed in {elapsed:.6f} seconds")