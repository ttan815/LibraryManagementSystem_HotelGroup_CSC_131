# check_data.py
import sys
sys.path.append('.')
from database import SessionLocal
from models import User, Book

def check_current_data():
    db = SessionLocal()
    try:
        print("=== CURRENT USERS ===")
        users = db.query(User).all()
        for user in users:
            print(f"ID: {user.id}, Username: {user.username}, Role: {user.role}")
        
        print("\n=== CURRENT BOOKS ===")
        books = db.query(Book).all()
        for book in books:
            print(f"ID: {book.id}, Title: {book.title}, Available: {book.available_copies}")
            
        return users, books
        
    except Exception as e:
        print(f"Error: {e}")
        return [], []
    finally:
        db.close()

if __name__ == "__main__":
    check_current_data()