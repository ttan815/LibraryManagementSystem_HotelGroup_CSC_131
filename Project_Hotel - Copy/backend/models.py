from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"
    LIBRARIAN = "librarian"

class LoanStatus(str, enum.Enum):
    ACTIVE = "active"
    RETURNED = "returned"
    OVERDUE = "overdue"

class ReservationStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(SQLEnum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    membership_dues = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    loans = relationship("Loan", back_populates="user")
    reservations = relationship("Reservation", back_populates="user")
    wishlist = relationship("Wishlist", back_populates="user")

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    author = Column(String, nullable=False)
    isbn = Column(String, unique=True, index=True)
    publisher = Column(String)
    publication_year = Column(Integer)
    category = Column(String)
    total_copies = Column(Integer, default=1)
    available_copies = Column(Integer, default=1)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    loans = relationship("Loan", back_populates="book")
    reservations = relationship("Reservation", back_populates="book")
    wishlist = relationship("Wishlist", back_populates="book")

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    loan_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=False)
    return_date = Column(DateTime, nullable=True)
    status = Column(SQLEnum(LoanStatus), default=LoanStatus.ACTIVE)
    overdue_fee = Column(Float, default=0.0)

    user = relationship("User", back_populates="loans")
    book = relationship("Book", back_populates="loans")

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    reservation_date = Column(DateTime, default=datetime.utcnow)
    pickup_date = Column(DateTime, nullable=True)
    expiry_date = Column(DateTime, nullable=False)
    status = Column(SQLEnum(ReservationStatus), default=ReservationStatus.PENDING)
    reservation_type = Column(String, default="loan")

    user = relationship("User", back_populates="reservations")
    book = relationship("Book", back_populates="reservations")

class Wishlist(Base):
    __tablename__ = "wishlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="wishlist")
    book = relationship("Book", back_populates="wishlist")
