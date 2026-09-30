from database import get_db_connection
from ingestion.sync import FPLSyncService

def run_worker():
    with get_db_connection() as db:
        FPLSyncService.sync_bootstrap_data(db)

if __name__ == "__main__":
    run_worker()