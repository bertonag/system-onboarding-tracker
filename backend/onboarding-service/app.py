# backend/onboarding-service/app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from models import db
from config import Config
from routes import onboarding_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    JWTManager(app)
    Migrate(app, db)
    
    # Register blueprint
    app.register_blueprint(onboarding_bp)
    
    @app.route('/health')
    def health():
        return {"status": "healthy", "service": "onboarding-service"}, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        db.create_all()   # For development only
    
    app.run(host='0.0.0.0', port=5002, debug=True)