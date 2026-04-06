from typing import Any, Dict, Optional

def format_response(status_code: int, message: str, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Standardizes the API response format for the backend.
    """
    response = {
        "status": status_code,
        "message": message,
    }
    if data is not None:
        response["data"] = data
        
    return response

def setup_logger(name: str):
    """
    Placeholder utility for setting up a logger.
    """
    import logging
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    return logger

def generate_random_id(length: int = 8) -> str:
    """
    Generates a random alphanumeric string ID.
    """
    import random
    import string
    characters = string.ascii_letters + string.digits
    return ''.join(random.choices(characters, k=length))

def get_current_timestamp() -> str:
    """
    Returns the current UTC timestamp as an ISO formatted string.
    """
    import datetime
    return datetime.datetime.utcnow().isoformat() + "Z"
