# recreate_admin.py
import sys
sys.path.append('.')
from database import SessionLocal
from models import User, UserRole
from auth import get_password_hash

def recreate_admin():
    db = SessionLocal()
    try:
        # Delete existing admin if exists
        existing = db.query(User).filter(User.username == "admin").first()
        if existing:
            db.delete(existing)
            print("Deleted existing admin user")
        
        # Create new admin
        new_admin = User(
            email="admin@library.com",
            username="admin",
            full_name="System Administrator",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(new_admin)
        db.commit()
        print("✅ Admin user recreated successfully!")
        print("Username: admin")
        print("Password: admin123")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    recreate_admin()