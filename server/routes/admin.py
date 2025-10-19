from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from auth import get_admin_user, get_password_hash

router = APIRouter()

@router.get("/users", response_model=List[schemas.User])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=schemas.User)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}", response_model=schemas.User)
def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.post("/books", response_model=schemas.Book)
def admin_create_book(
    book: schemas.BookCreate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    db_book = models.Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@router.put("/books/{book_id}", response_model=schemas.Book)
def admin_update_book(
    book_id: int,
    book: schemas.BookUpdate,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    for key, value in book.dict(exclude_unset=True).items():
        setattr(db_book, key, value)

    db.commit()
    db.refresh(db_book)
    return db_book

@router.delete("/books/{book_id}")
def admin_delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    db.delete(db_book)
    db.commit()
    return {"message": "Book deleted successfully"}

@router.get("/loans/overdue", response_model=List[schemas.Loan])
def get_overdue_loans(
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    from datetime import datetime
    loans = db.query(models.Loan).filter(
        models.Loan.status == models.LoanStatus.ACTIVE,
        models.Loan.due_date < datetime.utcnow()
    ).all()
    return loans

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
        models.Loan.due_date < models.datetime.utcnow()
    ).count()

    return {
        "total_users": total_users,
        "total_books": total_books,
        "active_loans": active_loans,
        "overdue_loans": overdue_loans
    }
