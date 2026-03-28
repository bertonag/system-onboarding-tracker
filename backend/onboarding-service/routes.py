# backend/onboarding-service/routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Project, ChecklistItem
from datetime import datetime

onboarding_bp = Blueprint('onboarding', __name__, url_prefix='/api/onboarding')

# ====================== PROJECTS ======================
@onboarding_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return jsonify([p.to_dict() for p in projects]), 200


@onboarding_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('template'):
        return jsonify({"error": "name and template are required"}), 400

    new_project = Project(
        name=data['name'],
        description=data.get('description'),
        template=data['template'],
        status=data.get('status', 'Pending'),
        progress=data.get('progress', 0),
        owner=data.get('owner', 'System')
    )
    
    db.session.add(new_project)
    db.session.commit()
    
    return jsonify(new_project.to_dict()), 201


# ====================== CHECKLISTS ======================
@onboarding_bp.route('/projects/<int:project_id>/checklist', methods=['GET'])
@jwt_required()
def get_checklist(project_id):
    checklist_type = request.args.get('type', 'SAC').upper()

    # Full templates from your Excel document
    templates = {
        "SAC": [
            {
                "stage": "Planning & Initiation",
                "items": [
                    {"id": 1, "no": "1.1", "requirement": "System concept note and business case", "team": "Sponsor", "status": False, "comments": ""},
                    {"id": 2, "no": "1.2", "requirement": "Confirm availability of funds", "team": "Owner", "status": False, "comments": ""},
                ]
            },
            {
                "stage": "Requirements Gathering & Analysis",
                "items": [
                    {"id": 3, "no": "2.1", "requirement": "Develop functional business requirements", "team": "Business Team", "status": False, "comments": ""},
                ]
            },
            {
                "stage": "Testing",
                "items": [
                    {"id": 4, "no": "6.1", "requirement": "Develop test cases and procedures", "team": "Business Team", "status": False, "comments": ""},
                ]
            }
        ],
        "MINOR": [
            {
                "stage": "Conceptualisation and requirements",
                "items": [
                    {"id": 101, "no": "1", "requirement": "Prepare a business case", "team": "Business Team", "status": False, "comments": ""},
                    {"id": 102, "no": "2", "requirement": "Carry out the User Acceptance Tests (UAT)", "team": "Business Team", "status": False, "comments": ""},
                ]
            },
            {
                "stage": "Deployment to production",
                "items": [
                    {"id": 103, "no": "3", "requirement": "Deployment to production", "team": "Technical Team", "status": False, "comments": ""},
                ]
            }
        ],
        "MODERATE": [
            {
                "stage": "Conceptualisation and requirements",
                "items": [
                    {"id": 201, "no": "1", "requirement": "Prepare draft of concept note/business case", "team": "Business Team", "status": False, "comments": ""},
                ]
            },
            {
                "stage": "Development/Coding & Testing",
                "items": [
                    {"id": 202, "no": "2", "requirement": "Carry out the User Acceptance Tests (UAT)", "team": "Business Team", "status": False, "comments": ""},
                ]
            }
        ],
        "MAJOR": [
            {
                "stage": "Conceptualisation and requirements",
                "items": [
                    {"id": 301, "no": "1", "requirement": "Prepare draft of concept note/business case", "team": "Business Team", "status": False, "comments": ""},
                ]
            },
            {
                "stage": "Training & Go-live",
                "items": [
                    {"id": 302, "no": "2", "requirement": "Training engagements for internal users", "team": "Business Team", "status": False, "comments": ""},
                ]
            }
        ]
    }

    items = templates.get(checklist_type, templates["SAC"])

    return jsonify({
        "project_id": project_id,
        "checklist_type": checklist_type,
        "stages": items
    }), 200


@onboarding_bp.route('/projects/<int:project_id>/checklist/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_checklist_item(project_id, item_id):
    data = request.get_json()
    
    # For now we simulate success. Later you can save to ChecklistItem table.
    return jsonify({
        "message": "Checklist item updated successfully",
        "project_id": project_id,
        "item_id": item_id,
        "status": data.get('status'),
        "start_date": data.get('start_date'),
        "finish_date": data.get('finish_date'),
        "comments": data.get('comments')
    }), 200

# ====================== CHECKLIST TEMPLATES ======================
@onboarding_bp.route('/checklist-templates', methods=['GET'])
@jwt_required()
def get_checklist_templates():
    """Return all checklist templates (SAC, MINOR, MODERATE, MAJOR)"""
    templates = {
        "SAC": [
            {
                "stage": "Planning & Initiation",
                "items": [
                    {"id": 1, "no": "1.1", "requirement": "System concept note and business case", "team": "Sponsor", "status": False, "comments": ""},
                    {"id": 2, "no": "1.2", "requirement": "Confirm availability of funds", "team": "Owner", "status": False, "comments": ""},
                ]
            },
            {
                "stage": "Requirements Gathering & Analysis",
                "items": [
                    {"id": 3, "no": "2.1", "requirement": "Develop functional business requirements", "team": "Business Team", "status": False, "comments": ""},
                ]
            },
            {
                "stage": "Testing",
                "items": [
                    {"id": 4, "no": "6.1", "requirement": "Develop test cases and procedures", "team": "Business Team", "status": False, "comments": ""},
                ]
            }
        ],
        "MINOR": [
            {
                "stage": "Conceptualisation and requirements",
                "items": [
                    {"id": 101, "no": "1", "requirement": "Prepare a business case", "team": "Business Team", "status": False, "comments": ""},
                    {"id": 102, "no": "2", "requirement": "Carry out the User Acceptance Tests (UAT)", "team": "Business Team", "status": False, "comments": ""},
                ]
            },
            {
                "stage": "Deployment to production",
                "items": [
                    {"id": 103, "no": "3", "requirement": "Deployment to production", "team": "Technical Team", "status": False, "comments": ""},
                ]
            }
        ],
        "MODERATE": [
            {
                "stage": "Conceptualisation and requirements",
                "items": [
                    {"id": 201, "no": "1", "requirement": "Prepare draft of concept note/business case", "team": "Business Team", "status": False, "comments": ""},
                ]
            },
            {
                "stage": "Development/Coding & Testing",
                "items": [
                    {"id": 202, "no": "2", "requirement": "Carry out the User Acceptance Tests (UAT)", "team": "Business Team", "status": False, "comments": ""},
                ]
            }
        ],
        "MAJOR": [
            {
                "stage": "Conceptualisation and requirements",
                "items": [
                    {"id": 301, "no": "1", "requirement": "Prepare draft of concept note/business case", "team": "Business Team", "status": False, "comments": ""},
                ]
            },
            {
                "stage": "Training & Go-live",
                "items": [
                    {"id": 302, "no": "2", "requirement": "Training engagements for internal users", "team": "Business Team", "status": False, "comments": ""},
                ]
            }
        ]
    }

    return jsonify(templates), 200