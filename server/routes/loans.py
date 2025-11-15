from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
import models
import schemas
from auth import get_current_active_user

router = APIRouter()
# Note that with parameters past, some are optional, they can be seen when looking in the schemas used to create these APIS.

# / when used with method POST, will create a loan object with the parameters: book_id, due_date, and loan_date.
@router.post("/", response_model=schemas.Loan)
def create_loan(
    loan: schemas.LoanCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    book = db.query(models.Book).filter(models.Book.id == loan.book_id).first() # Finds the book that fits the book_id, or else the book doesn't exist and it'll throw an error.
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if book.available_copies <= 0: # Ensures that when making a loan to checkout a book, that the book is still supplied, or else it'll throw an error.
        raise HTTPException(status_code=400, detail="No copies available")

    active_loan = db.query(models.Loan).filter( # Checks if the user already checked out the book, which is shown as a loan.
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
        loan_date=loan.loan_date
    )
    
    book.available_copies -= 1 # Takes away from the count of books to ensure people can't just keep loaning out a book even when no supply

    db.add(db_loan)
    db.commit()
    db.refresh(db_loan)
    return db_loan

# /{loan_id}/{return_date}/{book_id}/{overdue_fee}/{cancel}/return when used with the method PUT, will require the loan_id, return_date, book_id, overdue_fee, and the status on whether or not to cancel this loan (true or false), to all be passed in the parameter
@router.put("/{loan_id}/{return_date}/{bookid}/{overdue_fee}/{cancel}/return")
def return_loan(
    loan_id: int,
    return_date: str,
    bookid: int,
    cancel: bool,
    overdue_fee: float | None = None,
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

    if(cancel == True): # Adds a book back since it was returned so another person can loan it.
        book = db.query(models.Book).filter(models.Book.id == loan.book_id).first()
        book.available_copies += 1
        db.delete(loan)
        db.commit()
        return {"message": "Loan cancelled and deleted successfully"}

    # loan.return_date = datetime.utcnow()
    loan.return_date = datetime.fromisoformat(return_date.replace("Z", "+00:00"))

    loan.status = models.LoanStatus.RETURNED
    loan.book_id = bookid
    loan.overdue_fee = overdue_fee

    book = db.query(models.Book).filter(models.Book.id == loan.book_id).first()
    book.available_copies += 1

    if loan.return_date.replace(tzinfo=None) > loan.due_date.replace(tzinfo=None): # Calculates the fees if the book was overdue
        days_overdue = (loan.return_date.replace(tzinfo=None) - loan.due_date.replace(tzinfo=None)).days
        loan.overdue_fee = days_overdue * 1.0

    db.commit()
    db.refresh(loan)
    return {"message": "Book returned successfully", "overdue_fee": loan.overdue_fee}

# / when used with method GET, will get all the loans, for admins its all the loans in the database, and for users it's only the loans for them.
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
