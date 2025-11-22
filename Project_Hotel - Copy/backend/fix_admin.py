# fix_admin.py
import sys
sys.path.append('.')
from database import SessionLocal
from models import User, UserRole
from auth import get_password_hash

def fix_admin():
    db = SessionLocal()
    try:
        print("Checking for existing admin users...")
        
        # Find ALL admin users (there might be multiple)
        admin_users = db.query(User).filter(User.username == "admin").all()
        print(f"Found {len(admin_users)} admin user(s)")
        
        # Delete ALL of them
        for admin in admin_users:
            db.delete(admin)
            print(f"Deleted admin: {admin.username}")
        
        # Commit the deletions
        db.commit()
        print("All admin users deleted")
        
        # Now create a fresh admin
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
        print("✅ New admin user created successfully!")
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
    fix_admin()