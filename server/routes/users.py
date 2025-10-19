from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_active_user

router = APIRouter()

@router.get("/me", response_model=schemas.User)
def get_current_user_info(current_user: models.User = Depends(get_current_active_user)):
    return current_user

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

@router.get("/me/loans", response_model=List[schemas.Loan])
def get_user_loans(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return current_user.loans

@router.get("/me/reservations", response_model=List[schemas.Reservation])
def get_user_reservations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return current_user.reservations

@router.get("/me/wishlist", response_model=List[schemas.Wishlist])
def get_user_wishlist(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    return current_user.wishlist

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
