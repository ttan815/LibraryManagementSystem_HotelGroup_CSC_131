from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole, LoanStatus, ReservationStatus


# Schemas are essentially classes that will state what variables constitute the parameters required/optional for the API request, when classes have a parameter, it essentially inherits that parameter's variables (including required/optionals).
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    membership_dues: Optional[float] = None

class User(UserBase):
    id: int
    role: UserRole
    is_active: bool
    membership_dues: float
    created_at: datetime

    class Config:
        from_attributes = True

class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    publisher: Optional[str] = None
    publication_year: Optional[int] = None
    category: Optional[str] = None
    description: Optional[str] = None

class BookCreate(BookBase):
    total_copies: int = 1
    available_copies: int = 1

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    publisher: Optional[str] = None
    publication_year: Optional[int] = None
    category: Optional[str] = None
    total_copies: Optional[int] = None
    available_copies: Optional[int] = None
    description: Optional[str] = None

class Book(BookBase):
    id: int
    total_copies: int
    available_copies: int
    created_at: datetime

    class Config:
        from_attributes = True

class LoanBase(BaseModel):
    book_id: int
    due_date: datetime
    

class LoanCreate(LoanBase):
    loan_date: datetime

class Loan(LoanBase):
    id: int
    user_id: int
    loan_date: datetime
    return_date: Optional[datetime]
    status: LoanStatus
    overdue_fee: float

    class Config:
        from_attributes = True

class ReservationBase(BaseModel):
    book_id: int
    reservation_type: str = "loan"

class ReservationCreate(ReservationBase):
    expiry_date: datetime
    user_id: Optional[int] = None

class Reservation(ReservationBase):
    id: int
    user_id: int
    reservation_date: datetime
    pickup_date: Optional[datetime]
    expiry_date: datetime
    status: ReservationStatus

    class Config:
        from_attributes = True

class WishlistCreate(BaseModel):
    book_id: int

class Wishlist(BaseModel):
    id: int
    user_id: int
    book_id: int
    added_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str
