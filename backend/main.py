from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routes import auth, books, users, loans, reservations, admin, contact

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Library Management System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(books.router, prefix="/api/books", tags=["Books"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(loans.router, prefix="/api/loans", tags=["Loans"])
app.include_router(reservations.router, prefix="/api/reservations", tags=["Reservations"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])

@app.get("/")
def root():
    return {"message": "Library Management System API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
