# backend/onboarding-service/models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    template = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="Pending")
    progress = db.Column(db.Integer, default=0)
    owner = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'template': self.template,
            'status': self.status,
            'progress': self.progress,
            'owner': self.owner,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class ChecklistItem(db.Model):
    __tablename__ = 'checklist_items'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    checklist_type = db.Column(db.String(20), nullable=False)   # SAC, Minor, Moderate, Major
    no = db.Column(db.String(20))                               # e.g. "1.1", "1"
    stage = db.Column(db.String(100))
    requirement = db.Column(db.Text, nullable=False)
    team = db.Column(db.String(100))
    status = db.Column(db.Boolean, default=False)               # Completed or not
    start_date = db.Column(db.Date)
    finish_date = db.Column(db.Date)
    comments = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'no': self.no,
            'stage': self.stage,
            'requirement': self.requirement,
            'team': self.team,
            'status': self.status,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'finish_date': self.finish_date.isoformat() if self.finish_date else None,
            'comments': self.comments
        }