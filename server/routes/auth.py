from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

# Note that with parameters past, some are optional, they can be seen when looking in the schemas used to create these APIS.

# /register when used with a method GET, will take the associated parameters: email, username, full_name, and a password (which will be hashed to be unrecognizable even in the database to anyone looking.)
# Response returned will look like:
# {
#   "email": "user@example.com",
#   "username": "string",
#   "full_name": "string",
#   "id": 0,
#   "role": "user",
#   "is_active": true,
#   "membership_dues": 0,
#   "created_at": "2025-11-15T08:42:47.051Z"
# }
@router.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first() # Sees if the user with that email already exists
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = db.query(models.User).filter(models.User.username == user.username).first() # Sees if the user with that username already exists
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = get_password_hash(user.password) # Function that will scramble/hash the password to the point it's a set length and is extremely hard to brute force without the hash to check if the password is valid.
    db_user = models.User( # Loads up the user model with the info to create it
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    # Adds the user to the database, then actualizes it, then refreshes the database.
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# /login when used with the method POST, which will return the authentication token, which is central to determining what API's that the user will be able to access, view for parts of the website, as well as displaying their username
# Response will look something like:
# {
#   "access_token": "string",
#   "token_type": "string"
# }
@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
