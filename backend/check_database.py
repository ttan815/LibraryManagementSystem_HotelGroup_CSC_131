# check_database.py
import sys
sys.path.append('.')
from database import SessionLocal, engine
from models import User

def check_database():
    print("Checking database...")
    try:
        # Test database connection
        db = SessionLocal()
        users_count = db.query(User).count()
        print(f"✅ Database connected. Total users: {users_count}")
        
        # List all users
        users = db.query(User).all()
        print("Users in database:")
        for user in users:
            print(f"  - {user.username} ({user.email}) - Role: {user.role}")
        
        db.close()
        return True
    except Exception as e:
        print(f"❌ Database error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    check_database()