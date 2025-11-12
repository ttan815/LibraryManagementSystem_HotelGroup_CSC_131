from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_current_active_user

router = APIRouter()

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

    db_reservation = models.Reservation(
        user_id=current_user.id,
        book_id=reservation.book_id,
        expiry_date=reservation.expiry_date,
        reservation_type=reservation.reservation_type
    )
    if(reservation.user_id != None):
        db_reservation = models.Reservation(
            user_id=reservation.user_id,
            book_id=reservation.book_id,
            expiry_date=reservation.expiry_date,
            reservation_type=reservation.reservation_type
        )
        

    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

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
        reservations = db.query(models.Reservation).offset(skip).limit(limit).all()
        # reservations = db.query(models.Reservation).filter(
        #     models.Reservation.user_id == current_user.id
        # ).offset(skip).limit(limit).all()
    return reservations

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
