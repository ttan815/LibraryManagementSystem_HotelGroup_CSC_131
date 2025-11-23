# create_admin.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import User, UserRole
from auth import get_password_hash

def create_admin_user():
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.username == "admin").first()
        if existing_admin:
            print("Admin user already exists!")
            return

        # Create admin user
        admin_user = User(
            email="admin@library.com",
            username="admin",
            full_name="System Administrator",
            hashed_password=get_password_hash("admin123"),  # Change this password!
            role=UserRole.ADMIN,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        print("Admin user created successfully!")
        print("Username: admin")
        print("Password: admin123")  # Change this immediately!
        print("Email: admin@library.com")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()