from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
import models
import schemas
from auth import get_admin_user, get_password_hash

router = APIRouter()

# All these API calls are for admin, and require the token for authorization to have the user info with role of type Admin

# /users will return an array when used with the method GET, containing all the user objects
# Example returned:
# [
#   {
#     "email": "user@example.com",
#     "username": "string",
#     "full_name": "string",
#     "id": 0,
#     "role": "user",
#     "is_active": true,
#     "membership_dues": 0,
#     "created_at": "2025-11-15T08:15:48.010Z"
#   }
# ]
@router.get("/users", response_model=List[schemas.User])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

# /users/{user_id} will return a user object when used with a method GET, that will contain the data of the user_id passed in the API
# Example returned:
# {
#   "email": "user@example.com",
#   "username": "string",
#   "full_name": "string",
#   "id": 0,
#   "role": "user",
#   "is_active": true,
#   "membership_dues": 0,
#   "created_at": "2025-11-15T08:16:47.046Z"
# }
@router.get("/users/{user_id}", response_model=schemas.User)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first() # Searches for the first user that has that user_id, and if it's not found it'll throw an error.
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# /users/{user_id} when used with a method PUT, will update the info of the user associated with the user_id passed in the API, and can change the user's info for: email, full name, and membership dues.
@router.put("/users/{user_id}", response_model=schemas.User)
def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first() # Finds the user in the database to update, and if it doesn't find such user, it'll throw an error.
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent modifying your own role or status
    if user_id == admin_user.id:
        if user_update.role is not None and user_update.role != admin_user.role:
            raise HTTPException(status_code=400, detail="Cannot change your own role")
        if user_update.is_active is not None and not user_update.is_active:
            raise HTTPException(status_code=400, detail="Cannot deactivate your own account")

    # Prevent changing admin users to non-admin if they're the only admin
    if (user_update.role is not None and 
        user_update.role != models.UserRole.ADMIN and 
        user.role == models.UserRole.ADMIN):
        
        # Check if this is the only admin user
        admin_count = db.query(models.User).filter(
            models.User.role == models.UserRole.ADMIN,
            models.User.is_active == True
        ).count()
        
        if admin_count <= 1:
            raise HTTPException(
                status_code=400, 
                detail="Cannot remove admin role from the only active admin user"
            )

    # Check for duplicate username
    if user_update.username and user_update.username != user.username:
        existing_user = db.query(models.User).filter(
            models.User.username == user_update.username
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists")

    # Check for duplicate email
    if user_update.email and user_update.email != user.email:
        existing_user = db.query(models.User).filter(
            models.User.email == user_update.email
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists")

    # Update all provided fields
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user

# /users/{user_id} when used with a method DELETE will delete the user associated with the user_id passed in the API
@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first() # Searches for the user in the database to delete, and if it's not found, it'll throw an error.
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent admin from deleting themselves
    if user.id == admin_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    # PREVENT DELETING ADMIN USERS
    if user.role == models.UserRole.ADMIN:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete admin users. Please change their role to 'user' first if you want to remove admin privileges."
        )

    try:
        # Soft delete: anonymize data and deactivate (recommended approach)
        timestamp = int(datetime.utcnow().timestamp())
        user.email = f"deleted_{timestamp}@deleted.com"
        user.username = f"deleted_{timestamp}"
        user.full_name = "Deleted User"
        user.is_active = False
        
        db.commit()
        
        return {"message": "User account deactivated and data anonymized"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing user deletion: {str(e)}")

# /books when used with a method POST will create a book with the associated parameters such as: title, author, isbn, publisher, publication_year, category, description, total_copies, and available_copies
@router.post("/books", response_model=schemas.Book)
def admin_create_book(
    book: schemas.BookCreate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    db_book = models.Book(**book.dict())
    db.add(db_book) # Adds to the database
    db.commit() # actualizes it in the database
    db.refresh(db_book) # refreshes the database
    return db_book

# /books/{book_id} will modify a book when used with a method PUT, based on the associated book_id passed in the parameter with: title, author, publisher, publication_year, category, total_copies, available_copies, description
# It'll respond with something like:
# {
#   "title": "string",
#   "author": "string",
#   "isbn": "string",
#   "publisher": "string",
#   "publication_year": 0,
#   "category": "string",
#   "description": "string",
#   "id": 0,
#   "total_copies": 0,
#   "available_copies": 0,
#   "created_at": "2025-11-15T08:30:09.145Z"
# }
@router.put("/books/{book_id}", response_model=schemas.Book)
def admin_update_book(
    book_id: int,
    book: schemas.BookUpdate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first() # Searches for the book in the database, where if it's not found it'll raise an error.
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    for key, value in book.dict(exclude_unset=True).items():
        setattr(db_book, key, value)

    db.commit()
    db.refresh(db_book)
    return db_book

# /books/{book_id} with a method DELETE will go ahead and delete the book with the associated book_id from the database
@router.delete("/books/{book_id}")
def admin_delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first() # Tries to find a book that has the book_id with the ones in the database for books, and if it doesn't find it, it'll throw an error.
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    db.delete(db_book)
    db.commit()
    return {"message": "Book deleted successfully"}

# /loans/overdue when used with a method GET will get all loans that are currently past the date it was due.
@router.get("/loans/overdue", response_model=List[schemas.Loan])
def get_overdue_loans(
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    from datetime import datetime
    loans = db.query(models.Loan).filter( # This logic will search for loans that are ACTIVE in status and have a due date which is in the past from where the current time/date is.
        models.Loan.status == models.LoanStatus.ACTIVE,
        models.Loan.due_date < datetime.utcnow()
    ).all()
    return loans

# /dashboard when used with the method GET will return the numbers for how many users, books, active loans, and overdue loans.
@router.get("/dashboard") 
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    total_users = db.query(models.User).count()
    total_books = db.query(models.Book).count()
    active_loans = db.query(models.Loan).filter(models.Loan.status == models.LoanStatus.ACTIVE).count()
    overdue_loans = db.query(models.Loan).filter(
        models.Loan.status == models.LoanStatus.ACTIVE,
        models.Loan.due_date < datetime.utcnow()
    ).count()

    return {
        "total_users": total_users,
        "total_books": total_books,
        "active_loans": active_loans,
        "overdue_loans": overdue_loans
    }

# NEW ENDPOINT: Get all wishlists across all users
@router.get("/wishlists", response_model=List[schemas.Wishlist])
def get_all_wishlists(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    """
    Get all wishlists across all users (admin only)
    """
    wishlists = db.query(models.Wishlist).offset(skip).limit(limit).all()
    return wishlists