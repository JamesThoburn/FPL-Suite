import os
import requests
from dotenv import load_dotenv

load_dotenv()

def _get_json(url: str):
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise RuntimeError(f"Failed to fetch data from {url}: {exc}") from exc
    
    try:
        return response.json()
    except ValueError as exc:
        raise ValueError(f"Received invalid JSON from {url}: {exc}") from exc

def fetch_bootstrap():
    base_url = os.getenv("FPL_API_BASE_URL")
    if not base_url:
        raise RuntimeError("FPL_API_BASE_URL is not configured")

    url = f"{base_url}/bootstrap-static/"
    data = _get_json(url)

    if not isinstance(data, dict):
        raise ValueError(
            f"Unexpected response shape from {url}: expected JSON object, got {type(data).__name__}"
        )
    
    return data

def fetch_fixtures():
    base_url = os.getenv("FPL_API_BASE_URL")
    if not base_url:
        raise RuntimeError("FPL_API_BASE_URL is not configured")

    url = f"{base_url}/fixtures/"
    data = _get_json(url)

    if not isinstance(data, list):
        raise ValueError(
            f"Unexpected response shape from {url}: expected JSON array, got {type(data).__name__}"
        )

    return data