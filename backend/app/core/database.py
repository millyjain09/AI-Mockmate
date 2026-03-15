# backend/app/core/database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv() # .env file load karega

MONGO_URL = os.getenv("MONGO_URL")

try:
    client = MongoClient(MONGO_URL)
    db = client["ai_interviewer_db"] # Database ka naam
    print("✅ Connected to MongoDB Successfully!")
except Exception as e:
    print(f"❌ Could not connect to MongoDB: {e}")