# backend/auth-service/routes.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from functools import wraps
from models import db, User, Role, Permission
from utils import create_token

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# ────────────────────────────────────────────────
# Permission decorator
# ────────────────────────────────────────────────

def permission_required(required_perm):
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            if not user.is_active:
                return jsonify({"error": "Account inactive"}), 403
            
            user_perms = user.get_permissions()
            
            if required_perm not in user_perms:
                current_app.logger.warning(
                    f"Permission denied: user {user.username} tried {required_perm}"
                )
                return jsonify({
                    "error": "Insufficient permissions",
                    "required": required_perm
                }), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# ────────────────────────────────────────────────
# Registration decorator
# ────────────────────────────────────────────────

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password') or not data.get('email'):
        return jsonify({"error": "Missing required fields"}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 409
    
    user = User(
        username=data['username'],
        email=data['email'],
        full_name=data.get('full_name')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    token = create_token(user.id)
    
    return jsonify({
        "message": "User created successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        },
        "token": token
    }), 201

# ────────────────────────────────────────────────
# Login decorator
# ────────────────────────────────────────────────

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing username or password"}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid username or password"}), 401
    
    if not user.is_active:
        return jsonify({"error": "Account is inactive"}), 403

    user_permissions = user.get_permissions()          # This returns a set
    
    token = create_token(user.id, user_permissions)    # Pass the set → function will convert it

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        },
        "token": token
    }), 200

# ────────────────────────────────────────────────
# Current user decorator
# ────────────────────────────────────────────────
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "is_active": user.is_active
    }), 200

# ────────────────────────────────────────────────
# RBAC protected endpoints
# ────────────────────────────────────────────────

@auth_bp.route('/admin/dashboard', methods=['GET'])
@permission_required('view_admin_dashboard')
def admin_dashboard():
    return jsonify({
        "message": "Welcome to admin dashboard",
        "sensitive_data": "only visible to users with 'view_admin_dashboard' permission"
    })

@auth_bp.route('/projects/manage', methods=['POST'])
@permission_required('manage_projects')
def manage_projects():
    # This would call the onboarding-service in real setup
    return jsonify({"message": "Project management endpoint (RBAC protected)"})

@auth_bp.route('/checklists/edit', methods=['PUT'])
@permission_required('edit_checklist_items')
def edit_checklist():
    return jsonify({"message": "Checklist edit allowed"})