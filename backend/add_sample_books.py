# add_sample_books.py
import sys
sys.path.append('.')
from database import SessionLocal
from models import Book
from datetime import datetime

def add_sample_books():
    db = SessionLocal()
    try:
        sample_books = [
            {
                "title": "The Great Gatsby",
                "author": "F. Scott Fitzgerald",
                "isbn": "9780743273565",
                "publisher": "Scribner",
                "publication_year": 1925,
                "category": "Classic Literature",
                "description": "A story of wealth, love, and the American Dream in the 1920s.",
                "total_copies": 3,
                "available_copies": 3
            },
            {
                "title": "To Kill a Mockingbird",
                "author": "Harper Lee",
                "isbn": "9780061120084",
                "publisher": "J.B. Lippincott & Co.",
                "publication_year": 1960,
                "category": "Classic Literature",
                "description": "A gripping story of racial injustice and childhood innocence in the American South.",
                "total_copies": 2,
                "available_copies": 2
            },
            {
                "title": "1984",
                "author": "George Orwell",
                "isbn": "9780451524935",
                "publisher": "Secker & Warburg",
                "publication_year": 1949,
                "category": "Dystopian Fiction",
                "description": "A dystopian social science fiction novel about totalitarian control.",
                "total_copies": 4,
                "available_copies": 4
            },
            {
                "title": "Pride and Prejudice",
                "author": "Jane Austen",
                "isbn": "9780141439518",
                "publisher": "T. Egerton",
                "publication_year": 1813,
                "category": "Romance",
                "description": "A romantic novel about Elizabeth Bennet and Mr. Darcy.",
                "total_copies": 3,
                "available_copies": 3
            },
            {
                "title": "The Hobbit",
                "author": "J.R.R. Tolkien",
                "isbn": "9780547928227",
                "publisher": "George Allen & Unwin",
                "publication_year": 1937,
                "category": "Fantasy",
                "description": "A fantasy novel about Bilbo Baggins and his adventure.",
                "total_copies": 5,
                "available_copies": 5
            },
            {
                "title": "Harry Potter and the Sorcerer's Stone",
                "author": "J.K. Rowling",
                "isbn": "9780590353427",
                "publisher": "Bloomsbury",
                "publication_year": 1997,
                "category": "Fantasy",
                "description": "The first book in the Harry Potter series.",
                "total_copies": 6,
                "available_copies": 6
            },
            {
                "title": "The Catcher in the Rye",
                "author": "J.D. Salinger",
                "isbn": "9780316769174",
                "publisher": "Little, Brown and Company",
                "publication_year": 1951,
                "category": "Coming-of-Age",
                "description": "A story about teenage rebellion and alienation.",
                "total_copies": 2,
                "available_copies": 2
            },
            {
                "title": "Lord of the Flies",
                "author": "William Golding",
                "isbn": "9780571056866",
                "publisher": "Faber and Faber",
                "publication_year": 1954,
                "category": "Allegorical Novel",
                "description": "A story about a group of British boys stranded on an uninhabited island.",
                "total_copies": 3,
                "available_copies": 3
            },
            {
                "title": "The Da Vinci Code",
                "author": "Dan Brown",
                "isbn": "9780307474278",
                "publisher": "Doubleday",
                "publication_year": 2003,
                "category": "Mystery Thriller",
                "description": "A mystery thriller novel about a conspiracy within the Catholic Church.",
                "total_copies": 4,
                "available_copies": 4
            },
            {
                "title": "The Alchemist",
                "author": "Paulo Coelho",
                "isbn": "9780061122415",
                "publisher": "HarperCollins",
                "publication_year": 1988,
                "category": "Philosophical Fiction",
                "description": "A philosophical book about following your dreams.",
                "total_copies": 3,
                "available_copies": 3
            },
            {
                "title": "Brave New World",
                "author": "Aldous Huxley",
                "isbn": "9780060850524",
                "publisher": "Chatto & Windus",
                "publication_year": 1932,
                "category": "Dystopian Fiction",
                "description": "A dystopian novel about a futuristic society.",
                "total_copies": 2,
                "available_copies": 2
            },
            {
                "title": "The Hunger Games",
                "author": "Suzanne Collins",
                "isbn": "9780439023481",
                "publisher": "Scholastic",
                "publication_year": 2008,
                "category": "Young Adult Dystopian",
                "description": "A dystopian novel about a televised death competition.",
                "total_copies": 5,
                "available_copies": 5
            },
            {
                "title": "The Shining",
                "author": "Stephen King",
                "isbn": "9780307743657",
                "publisher": "Doubleday",
                "publication_year": 1977,
                "category": "Horror",
                "description": "A horror novel about a family overseeing a haunted hotel.",
                "total_copies": 3,
                "available_copies": 3
            },
            {
                "title": "Gone Girl",
                "author": "Gillian Flynn",
                "isbn": "9780307588364",
                "publisher": "Crown Publishing Group",
                "publication_year": 2012,
                "category": "Psychological Thriller",
                "description": "A psychological thriller about a marriage gone wrong.",
                "total_copies": 4,
                "available_copies": 4
            },
            {
                "title": "The Martian",
                "author": "Andy Weir",
                "isbn": "9780553418026",
                "publisher": "Crown",
                "publication_year": 2011,
                "category": "Science Fiction",
                "description": "A science fiction novel about an astronaut stranded on Mars.",
                "total_copies": 3,
                "available_copies": 3
            }
        ]

        added_count = 0
        for book_data in sample_books:
            # Check if book already exists by ISBN
            existing_book = db.query(Book).filter(Book.isbn == book_data["isbn"]).first()
            if not existing_book:
                book = Book(**book_data)
                db.add(book)
                added_count += 1
                print(f"Added: {book_data['title']} by {book_data['author']}")
            else:
                print(f"Already exists: {book_data['title']}")

        db.commit()
        print(f"\n✅ Successfully added {added_count} new books to the library!")
        print(f"Total books in database: {db.query(Book).count()}")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    add_sample_books()