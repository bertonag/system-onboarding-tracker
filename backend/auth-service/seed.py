# Run this in python shell after db.create_all() or flask shell
from app import create_app
from models import db, Role, Permission, User

app = create_app()
with app.app_context():
    db.create_all()
    
    # Create permissions
    perms = [
        Permission(name="view_projects", description="View onboarding projects"),
        Permission(name="edit_checklist_items", description="Update checklist status"),
        Permission(name="manage_projects", description="Create/delete projects"),
        Permission(name="manage_users", description="Admin user management"),
        Permission(name="view_admin_dashboard", description="See admin stats"),
    ]
    for p in perms:
        if not Permission.query.filter_by(name=p.name).first():
            db.session.add(p)
    
    # Create roles
    admin_role = Role.query.filter_by(name='admin').first()
    if not admin_role:
        admin_role = Role(name='admin', description='Full access')
        admin_role.permissions = perms  # all permissions
        db.session.add(admin_role)
    
    viewer_role = Role.query.filter_by(name='viewer').first()
    if not viewer_role:
        viewer_role = Role(name='viewer', description='Read-only')
        viewer_role.permissions = [Permission.query.filter_by(name="view_projects").first()]
        db.session.add(viewer_role)
    
    db.session.commit()
    
    # Optional: assign admin role to your test user
    user = User.query.filter_by(username="gilbert").first()
    if user and admin_role not in user.roles:
        user.roles.append(admin_role)
        db.session.commit()
        print("Assigned admin role to gilbert")