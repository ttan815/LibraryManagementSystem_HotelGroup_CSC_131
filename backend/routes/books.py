from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas
from auth import get_current_active_user

router = APIRouter()

# Note that with parameters past, some are optional, they can be seen when looking in the schemas used to create these APIS.

# / when used with method GET, does not require any authentication (no token required)
# Response will look like this:
# [
#   {
#     "title": "string",
#     "author": "string",
#     "isbn": "string",
#     "publisher": "string",
#     "publication_year": 0,
#     "category": "string",
#     "description": "string",
#     "id": 0,
#     "total_copies": 0,
#     "available_copies": 0,
#     "created_at": "2025-11-15T08:47:16.216Z"
#   }
# ]
@router.get("/", response_model=List[schemas.Book]) #response_model is like the return type, which is this case should look like the response above
def get_books(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Book)

    if search: # Optional parameter, will see if the search keyword is present in the title or author or isbn
        query = query.filter(
            (models.Book.title.contains(search)) |
            (models.Book.author.contains(search)) |
            (models.Book.isbn.contains(search))
        )

    if category: # Optional parameter, will see if the category keyword is present in the categories of all books
        query = query.filter(models.Book.category == category)

    books = query.offset(skip).limit(limit).all()
    return books

# /{book_id} when used with a method GET will return a book that has has it's id equivalent to book_id passed with the API
# Response will look like:
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
#   "created_at": "2025-11-15T08:52:01.500Z"
# }
@router.get("/{book_id}", response_model=schemas.Book)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first() # looks for the first book that has matching ids with the one passed in the API, if not found it'll throw an error.
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

# / when used with method POST, will go aheed and create a book when given the parameters: title, author, isbn, publisher, publication_year, category, description, total_copies, and available_copies
@router.post("/", response_model=schemas.Book)
def create_book(
    book: schemas.BookCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_book = models.Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

# /{book_id} when used with method PUT, will look for a book and modify based on the parameters: title, author, publisher, publication_year, category, total_copies, available_copies, and description.
@router.put("/{book_id}", response_model=schemas.Book)
def update_book(
    book_id: int,
    book: schemas.BookUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    for key, value in book.dict(exclude_unset=True).items():
        setattr(db_book, key, value)

    db.commit()
    db.refresh(db_book)
    return db_book

# /{book_id} when used with method DELETE will go ahead and search for a book that has that book_id passed with the API, and delete it from the database
@router.delete("/{book_id}")
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    db.delete(db_book)
    db.commit()
    return {"message": "Book deleted successfully"}
