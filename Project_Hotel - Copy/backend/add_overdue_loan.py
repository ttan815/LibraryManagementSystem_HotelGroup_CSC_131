# add_overdue_loan.py
import sys
sys.path.append('.')
from database import SessionLocal
from models import Loan, LoanStatus
from datetime import datetime, timedelta

def add_overdue_loan():
    db = SessionLocal()
    try:
        # Get available user and book
        from models import User, Book
        
        users = db.query(User).all()
        books = db.query(Book).filter(Book.available_copies > 0).first()  # Get first available book
        
        if not users or not books:
            print("❌ Need at least 1 user and 1 available book")
            return
        
        user = users[0]
        print(f"Using user: {user.username}, book: {books.title}")
        
        # Create an overdue loan (due date is in the past)
        overdue_loan = Loan(
            user_id=user.id,
            book_id=books.id,
            loan_date=datetime.utcnow() - timedelta(days=15),  # Loaned 15 days ago
            due_date=datetime.utcnow() - timedelta(days=5),    # Due 5 days ago (overdue!)
            return_date=None,
            status=LoanStatus.ACTIVE,
            overdue_fee=5.0  # $5 overdue fee
        )
        
        # Reduce available copies since book is loaned
        books.available_copies -= 1
        
        db.add(overdue_loan)
        db.commit()
        
        print(f"✅ Added overdue loan for {user.username}")
        print(f"   Book: {books.title}")
        print(f"   Loaned: {overdue_loan.loan_date.strftime('%Y-%m-%d')}")
        print(f"   Due: {overdue_loan.due_date.strftime('%Y-%m-%d')} (OVERDUE!)")
        print(f"   Overdue fee: ${overdue_loan.overdue_fee}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    add_overdue_loan()