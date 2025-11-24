from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from database import get_db
import models
import schemas
from auth import get_current_active_user

router = APIRouter()

# / when used with method POST, it will take parameters: book_id, reservation_type, expiry_date
@router.post("/", response_model=schemas.Reservation)
def create_reservation(
    reservation: schemas.ReservationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    book = db.query(models.Book).filter(models.Book.id == reservation.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    active_reservation = db.query(models.Reservation).filter(
        models.Reservation.user_id == current_user.id,
        models.Reservation.book_id == reservation.book_id,
        models.Reservation.status.in_([models.ReservationStatus.PENDING, models.ReservationStatus.ACTIVE])
    ).first()

    if active_reservation:
        raise HTTPException(status_code=400, detail="You already have an active reservation for this book")

    # FIXED: Use current user's ID and set default expiry if not provided
    db_reservation = models.Reservation(
        user_id=current_user.id,  # Always use current user's ID
        book_id=reservation.book_id,
        reservation_date=reservation.reservation_date or datetime.utcnow(),
        expiry_date=reservation.expiry_date or datetime.utcnow() + timedelta(days=7),
        reservation_type=reservation.reservation_type
    )

    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

# / when used with the method GET, it'll go ahead and return all the reservations
@router.get("/", response_model=List[schemas.Reservation])
def get_reservations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    if current_user.role in [models.UserRole.ADMIN, models.UserRole.LIBRARIAN]:
        reservations = db.query(models.Reservation).offset(skip).limit(limit).all()
    else:
        reservations = db.query(models.Reservation).filter(
            models.Reservation.user_id == current_user.id
        ).offset(skip).limit(limit).all()
    return reservations

# /{reservation_id}/cancel when used with method PUT
@router.put("/{reservation_id}/cancel")
def cancel_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    reservation = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")

    if reservation.user_id != current_user.id and current_user.role not in [models.UserRole.ADMIN, models.UserRole.LIBRARIAN]:
        raise HTTPException(status_code=403, detail="Not authorized")

    reservation.status = models.ReservationStatus.CANCELLED
    db.commit()
    return {"message": "Reservation cancelled successfully"}