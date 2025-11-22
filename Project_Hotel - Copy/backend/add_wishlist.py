# add_wishlist.py
import sys
sys.path.append('.')
from database import SessionLocal
from models import Wishlist

def add_wishlist_items():
    db = SessionLocal()
    try:
        # Get users and books
        from models import User, Book
        
        users = db.query(User).all()
        books = db.query(Book).all()
        
        if len(users) < 1 or len(books) < 5:
            print("❌ Need at least 1 user and 5 books")
            return
        
        user = users[0]  # Use first user
        print(f"Adding wishlist items for user: {user.username}")
        
        # Add 5 different books to wishlist
        wishlist_books = books[:5]  # First 5 books
        
        added_count = 0
        for book in wishlist_books:
            # Check if already in wishlist
            existing = db.query(Wishlist).filter(
                Wishlist.user_id == user.id,
                Wishlist.book_id == book.id
            ).first()
            
            if not existing:
                wishlist_item = Wishlist(
                    user_id=user.id,
                    book_id=book.id
                )
                db.add(wishlist_item)
                added_count += 1
                print(f"✅ Added to wishlist: '{book.title}' by {book.author}")
            else:
                print(f"⚠️  Already in wishlist: '{book.title}'")
        
        db.commit()
        print(f"\n🎉 Successfully added {added_count} items to wishlist!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    add_wishlist_items()