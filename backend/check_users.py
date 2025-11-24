# check_users.py
import sys
sys.path.append('.')
from database import SessionLocal
from models import User

def check_all_users():
    db = SessionLocal()
    try:
        print("All users in database:")
        users = db.query(User).all()
        for user in users:
            print(f"  - ID: {user.id}, Username: '{user.username}', Email: '{user.email}', Role: {user.role}")
        
        print(f"\nTotal users: {len(users)}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_all_users()