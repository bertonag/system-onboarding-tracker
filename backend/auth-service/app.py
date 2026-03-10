# backend/auth-service/app.py
import logging
from flask import Flask, request
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from models import db
from config import Config
from routes import auth_bp

# Configure logging early
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    JWTManager(app)
    Migrate(app, db)

    # Register blueprint
    app.register_blueprint(auth_bp)

    # Debug logging for incoming Authorization headers
    @app.before_request
    def log_authorization_header():
        auth_header = request.headers.get('Authorization')
        if auth_header:
            # Log only first ~30 chars to avoid leaking full token
            preview = auth_header[:30] + '...' if len(auth_header) > 30 else auth_header
            app.logger.debug(f"Received Authorization header: {preview}")

    # Health check endpoint
    @app.route('/health')
    def health():
        return {"status": "healthy", "service": "auth-service"}, 200

    return app


if __name__ == '__main__':
    app = create_app()

    # Only use create_all() during very early prototyping
    # After migrations are set up → remove or comment this block
    with app.app_context():
        db.create_all()           # ← comment out once migrations are reliable
        # Optional: print("Tables created (development mode)")

    # Run the app
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True,
        use_reloader=True
    )