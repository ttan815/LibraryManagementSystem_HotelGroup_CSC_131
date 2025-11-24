# Library Management System - Backend API

FastAPI backend for the Library Management System.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Features

- User authentication (register/login with JWT)
- Book management (CRUD operations)
- Loan system with due dates and overdue fees
- Reservation system
- User wishlist
- Admin dashboard
- Contact form submission

## Default Admin Account

Create an admin account manually or via the register endpoint, then update the role in the database.
