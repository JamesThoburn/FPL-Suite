import logging
import psycopg2
from config import settings

logger = logging.getLogger(__name__)

def get_db_connection():
    # Connect to the PostgreSQL database using the DATABASE_URL from config.py (environment variable)
    try:
        return psycopg2.connect(settings.DATABASE_URL)
    except psycopg2.Error:
        logger.exception("Failed to connect to PostgreSQL database")
        raise