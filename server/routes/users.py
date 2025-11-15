from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_active_user

router = APIRouter()
# Note that with parameters past, some are optional, they can be seen when looking in the schemas used to create these APIS.

# /me when used with method GET, will return the user information based on the token passed
# The response will look like:
# {
#   "email": "user@example.com",
#   "username": "string",
#   "full_name": "string",
#   "id": 0,
#   "role": "user",
#   "is_active": true,
#   "membership_dues": 0,
#   "created_at": "2025-11-15T09:23:10.922Z"
# }
@router.get("/me", response_model=schemas.User)
def get_current_user_info(current_user: models.User = Depends(get_current_active_user)):
    return current_user

# /me when used with method POST, will go ahead and update the user information based on information passed: email, full_name, and membership_dues.
# The response will look like:
# {
#   "email": "user@example.com",
#   "username": "string",
#   "full_name": "string",
#   "id": 0,
#   "role": "user",
#   "is_active": true,
#   "membership_dues": 0,
#   "created_at": "2025-11-15T09:23:48.540Z"
# }
@router.put("/me", response_model=schemas.User)
def update_current_user(
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return current_user

# /me/loans when used with method GET will get all the loans the user has for their user_id
# The response will look like this:
# [
#   {
#     "book_id": 0,
#     "due_date": "2025-11-15T09:24:48.128Z",
#     "id": 0,
#     "user_id": 0,
#     "loan_date": "2025-11-15T09:24:48.128Z",
#     "return_date": "2025-11-15T09:24:48.128Z",
#     "status": "active",
#     "overdue_fee": 0
#   }
# ]
@router.get("/me/loans", response_model=List[schemas.Loan])
def get_user_loans(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return current_user.loans

# /me/reservations when used with method GET will return all the reservations for their user_id
# The response will look like:
# [
#   {
#     "book_id": 0,
#     "reservation_type": "loan",
#     "id": 0,
#     "user_id": 0,
#     "reservation_date": "2025-11-15T09:25:38.596Z",
#     "pickup_date": "2025-11-15T09:25:38.596Z",
#     "expiry_date": "2025-11-15T09:25:38.596Z",
#     "status": "pending"
#   }
# ]
@router.get("/me/reservations", response_model=List[schemas.Reservation])
def get_user_reservations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return current_user.reservations


# /me/wishlist when used with method GET will return all the wishlists for their user_id
# The response will look like:
# [
#   {
#     "id": 0,
#     "user_id": 0,
#     "book_id": 0,
#     "added_at": "2025-11-15T09:26:45.108Z"
#   }
# ]
@router.get("/me/wishlist", response_model=List[schemas.Wishlist])
def get_user_wishlist(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return current_user.wishlist

# /me/wishlist when used with method POST will go ahead and add a wishlist to the database based on the parameters: book_id, and will check if it exists already, where it'll throw an error if so, or if that book specified to be wishlisted doesn't exist.
@router.post("/me/wishlist", response_model=schemas.Wishlist)
def add_to_wishlist(
    wishlist_item: schemas.WishlistCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    book = db.query(models.Book).filter(models.Book.id == wishlist_item.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    existing = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == current_user.id,
        models.Wishlist.book_id == wishlist_item.book_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Book already in wishlist")

    wishlist = models.Wishlist(user_id=current_user.id, book_id=wishlist_item.book_id)
    db.add(wishlist)
    db.commit()
    db.refresh(wishlist)
    return wishlist

# /me/wishlist/{book_id} when used with method DELETE will remove the book object with the book_id passed as a parameter with the API, and if it's not found it'll throw an error.
@router.delete("/me/wishlist/{book_id}")
def remove_from_wishlist(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    wishlist_item = db.query(models.Wishlist).filter(
        models.Wishlist.user_id == current_user.id,
        models.Wishlist.book_id == book_id
    ).first()

    if not wishlist_item:
        raise HTTPException(status_code=404, detail="Book not in wishlist")

    db.delete(wishlist_item)
    db.commit()
    return {"message": "Book removed from wishlist"}
