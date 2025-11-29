# add_reservations.py
import sys
sys.path.append('.')
from database import SessionLocal
from models import Reservation, ReservationStatus
from datetime import datetime, timedelta

def add_reservations():
    db = SessionLocal()
    try:
        # Get available users and books
        from models import User, Book
        
        users = db.query(User).all()
        books = db.query(Book).filter(Book.available_copies > 0).all()
        
        if len(users) < 2 or len(books) < 4:
            print("❌ Need at least 2 users and 4 available books")
            return
        
        print(f"Found {len(users)} users and {len(books)} available books")
        
        # Create 4 reservations
        reservations_data = [
            {
                "user_id": users[0].id,  # First user
                "book_id": books[0].id,  # First book
                "reservation_type": "loan",
                "expiry_date": datetime.utcnow() + timedelta(days=7),
                "status": ReservationStatus.PENDING
            },
            {
                "user_id": users[0].id,  # First user
                "book_id": books[1].id,  # Second book  
                "reservation_type": "reading",
                "expiry_date": datetime.utcnow() + timedelta(days=3),
                "status": ReservationStatus.ACTIVE
            },
            {
                "user_id": users[1].id if len(users) > 1 else users[0].id,  # Second user or first
                "book_id": books[2].id,  # Third book
                "reservation_type": "loan", 
                "expiry_date": datetime.utcnow() + timedelta(days=5),
                "status": ReservationStatus.PENDING
            },
            {
                "user_id": users[1].id if len(users) > 1 else users[0].id,  # Second user or first
                "book_id": books[3].id,  # Fourth book
                "reservation_type": "reading",
                "expiry_date": datetime.utcnow() + timedelta(days=2),
                "status": ReservationStatus.ACTIVE
            }
        ]
        
        added_count = 0
        for res_data in reservations_data:
            # Check if reservation already exists
            existing = db.query(Reservation).filter(
                Reservation.user_id == res_data["user_id"],
                Reservation.book_id == res_data["book_id"],
                Reservation.status.in_([ReservationStatus.PENDING, ReservationStatus.ACTIVE])
            ).first()
            
            if not existing:
                reservation = Reservation(**res_data)
                db.add(reservation)
                added_count += 1
                
                # Get user and book names for display
                user = db.query(User).filter(User.id == res_data["user_id"]).first()
                book = db.query(Book).filter(Book.id == res_data["book_id"]).first()
                print(f"✅ Added reservation: {user.username} -> '{book.title}' ({res_data['status']})")
            else:
                print(f"⚠️  Reservation already exists")
        
        db.commit()
        print(f"\n🎉 Successfully added {added_count} reservations!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    add_reservations()