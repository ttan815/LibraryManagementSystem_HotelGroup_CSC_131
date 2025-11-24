from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from database import get_db
import models
import schemas
from auth import get_current_active_user

router = APIRouter()

# Add a new schema for loan return
class LoanReturn(BaseModel):
    loan_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    return_date: datetime
    overdue_fee: Optional[float] = 0.0

# / when used with method POST, will create a loan object with the parameters: book_id, due_date, and loan_date.
@router.post("/", response_model=schemas.Loan)
def create_loan(
    loan: schemas.LoanCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    book = db.query(models.Book).filter(models.Book.id == loan.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="No copies available")

    active_loan = db.query(models.Loan).filter(
        models.Loan.user_id == current_user.id,
        models.Loan.book_id == loan.book_id,
        models.Loan.status == models.LoanStatus.ACTIVE
    ).first()

    if active_loan:
        raise HTTPException(status_code=400, detail="You already have an active loan for this book")

    db_loan = models.Loan(
        user_id=current_user.id,
        book_id=loan.book_id,
        due_date=loan.due_date,
        loan_date=loan.loan_date or datetime.utcnow()
    )
    
    book.available_copies -= 1

    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

# FIXED: Simplified return endpoint using request body
@router.put("/{loan_id}/return")
def return_loan(
    loan_id: int,
    return_data: LoanReturn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    loan = db.query(models.Loan).filter(models.Loan.id == loan_id).first()

    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    if loan.user_id != current_user.id and current_user.role not in [models.UserRole.ADMIN, models.UserRole.LIBRARIAN]: 
        raise HTTPException(status_code=403, detail="Not authorized")

    if loan.status == models.LoanStatus.RETURNED:
        raise HTTPException(status_code=400, detail="Loan already returned")

    loan.loan_date = return_data.loan_date
    loan.due_date = return_data.due_date
    loan.return_date = return_data.return_date
    loan.status = models.LoanStatus.RETURNED

    # Calculate overdue fee if applicable
    if loan.return_date.replace(tzinfo=None) > loan.due_date.replace(tzinfo=None):
        days_overdue = (loan.return_date.replace(tzinfo=None) - loan.due_date.replace(tzinfo=None)).days
        loan.overdue_fee = days_overdue * 1.0
    else:
        loan.overdue_fee = return_data.overdue_fee or 0.0

    if return_data.overdue_fee > 0.0:
        loan.overdue_fee = return_data.overdue_fee
    # Return book to available copies
    book = db.query(models.Book).filter(models.Book.id == loan.book_id).first()
    if book:
        book.available_copies += 1

    db.commit()
    db.refresh(loan)
    return {"message": "Book returned successfully", "overdue_fee": loan.overdue_fee}

# ADD: New endpoint to cancel loan
@router.put("/{loan_id}/cancel")
def cancel_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    loan = db.query(models.Loan).filter(models.Loan.id == loan_id).first()

    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    if loan.user_id != current_user.id and current_user.role not in [models.UserRole.ADMIN, models.UserRole.LIBRARIAN]:
        raise HTTPException(status_code=403, detail="Not authorized")

    if loan.status == models.LoanStatus.RETURNED:
        raise HTTPException(status_code=400, detail="Loan already returned")

    # Return book to available copies
    book = db.query(models.Book).filter(models.Book.id == loan.book_id).first()
    if book:
        book.available_copies += 1

    db.delete(loan)
    db.commit()
    return {"message": "Loan cancelled successfully"}

# / when used with method GET, will get all the loans
@router.get("/", response_model=List[schemas.Loan])
def get_loans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    if current_user.role in [models.UserRole.ADMIN, models.UserRole.LIBRARIAN]:
        loans = db.query(models.Loan).offset(skip).limit(limit).all()
    else:
        loans = db.query(models.Loan).filter(models.Loan.user_id == current_user.id).offset(skip).limit(limit).all()
    return loans