# add_overdue_loan.py
import sys
sys.path.append('.')
from database import SessionLocal
from models import Loan, LoanStatus
from datetime import datetime, timedelta, UTC

def add_overdue_loans():
    db = SessionLocal()
    try:
        # Get available users and books
        from models import User, Book
        
        users = db.query(User).all()
        available_books = db.query(Book).filter(Book.available_copies > 0).all()
        
        if len(users) < 5 or len(available_books) < 5:
            print(f"❌ Need at least 5 users and 5 available books (currently have {len(users)} users and {len(available_books)} available books)")
            return
        
        overdue_loans_added = 0
        
        for i in range(5):
            user = users[i]
            book = available_books[i]
            
            print(f"Using user: {user.username}, book: {book.title}")
            
            # Create an overdue loan (due date is in the past) - using timezone-aware datetime
            overdue_loan = Loan(
                user_id=user.id,
                book_id=book.id,
                loan_date=datetime.now(UTC) - timedelta(days=15),  # Loaned 15 days ago
                due_date=datetime.now(UTC) - timedelta(days=5),    # Due 5 days ago (overdue!)
                return_date=None,
                status=LoanStatus.ACTIVE,
                overdue_fee=5.0  # $5 overdue fee
            )
            
            # Reduce available copies since book is loaned
            book.available_copies -= 1
            
            db.add(overdue_loan)
            overdue_loans_added += 1
            print(f"   Created overdue loan #{i+1}")
        
        db.commit()
        
        print(f"✅ Added {overdue_loans_added} overdue loans")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    add_overdue_loans()