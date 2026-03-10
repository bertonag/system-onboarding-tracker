# backend/auth-service/utils.py
from flask_jwt_extended import create_access_token, get_jwt_identity
from datetime import timedelta
import os

def create_token(user_id, expires_delta=None):
    if expires_delta is None:
        expires_delta = timedelta(hours=24)
    
    # Convert to string"
    identity_str = str(user_id)
    
    return create_access_token(
        identity=identity_str,
        expires_delta=expires_delta
    )