# backend/app/models/user.py
from pydantic import BaseModel, EmailStr

# Signup ke liye data model
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Login ke liye data model
class UserLogin(BaseModel):
    email: EmailStr
    password: str