from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.database import db
from passlib.context import CryptContext

router = APIRouter()

# Password Hashing Setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- SCHEMAS ---
class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# --- HELPERS ---
def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# --- ROUTES ---

@router.post("/signup")
async def signup(user: UserSignup):
    # 1. Check if email already exists
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash Password
    hashed_password = get_password_hash(user.password)

    # 3. Save to Database
    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password
    }
    db.users.insert_one(new_user)

    # 👇 CORRECT RETURN: User data bhej rahe hain taaki Frontend Auto-Login kar sake
    return {
        "message": "User created successfully",
        "user": {
            "username": user.username,
            "email": user.email
        }
    }

@router.post("/login")
async def login(user: UserLogin):
    # 1. Find user by email
    db_user = db.users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    # 2. Check Password
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect password")

    # 3. Return Success
    return {
        "message": "Login successful",
        "user": {
            "username": db_user["username"],
            "email": db_user["email"]
        }
    }