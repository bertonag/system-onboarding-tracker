# backend/auth-service/utils.py
from flask_jwt_extended import create_access_token
from datetime import timedelta

def create_token(user_id, permissions=None):
    """
    Create JWT access token with optional permissions claim.
    """
    # Default expiration if none provided
    expires_delta = timedelta(hours=24)
    
    # Convert user_id to string (required)
    identity_str = str(user_id)
    
    # Convert permissions to list (JWT cannot serialize sets)
    if permissions is None:
        permissions = []
    elif isinstance(permissions, set):
        permissions = list(permissions)
    elif not isinstance(permissions, list):
        permissions = list(permissions)
    
    return create_access_token(
        identity=identity_str,
        additional_claims={"permissions": permissions},
        expires_delta=expires_delta
    )