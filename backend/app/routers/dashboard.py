from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import json
import os

router = APIRouter()

#  path of the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# 2. Save the JSON file in the same directory so it persists
DB_FILE = os.path.join(BASE_DIR, "user_history.json")

def load_db():
    """Loads the database safely, handling empty or missing files."""
    if not os.path.exists(DB_FILE):
        return []
    try:
        with open(DB_FILE, "r") as f:
            content = f.read().strip()
            if not content:  # If file is empty
                return []
            return json.loads(content)
    except Exception as e:
        print(f"❌ Error loading Database: {e}")
        return []

def save_db(data):
    """Saves the database to the JSON file."""
    try:
        with open(DB_FILE, "w") as f:
            json.dump(data, f, indent=4)
        print("✅ Database saved successfully!")
    except Exception as e:
        print(f"❌ Error saving Database: {e}")

# --- MODELS ---
class ActivityResult(BaseModel):
    email: str
    type: str       # 'coding', 'interview', 'english'
    topic: str
    score: int
    date: str       # Format: "YYYY-MM-DD"

# --- 1. SAVE ACTIVITY ---
@router.post("/dashboard/save")
async def save_activity(activity: ActivityResult):
    print(f"📥 Received Data: {activity.dict()}") 
    
    # 🔹 FIX: Normalize email to lowercase to prevent mismatches
    activity.email = activity.email.lower()

    db = load_db()
    
    # Add new entry
    new_entry = activity.dict()
    db.append(new_entry)
    
    save_db(db)
    return {"status": "success", "message": "Activity saved!"}

# --- 2. GET DASHBOARD STATS ---
@router.get("/dashboard/stats/{email}")
async def get_stats(email: str):
    # 🔹 FIX: Normalize email to lowercase
    email = email.lower()
    print(f"🔍 Fetching stats for: {email}") 
    
    db = load_db()
    
    # Filter user history
    user_history = [item for item in db if item.get("email") == email]
    
    # Sort by Date (Latest first)
    user_history.sort(key=lambda x: x['date'], reverse=True)

    if not user_history:
        return {
            "total_sessions": 0,
            "average_score": 0,
            "weekly_growth": 0,
            "streak": 0,
            "history": []
        }

    # --- CALCULATIONS ---
    total_sessions = len(user_history)
    
    # Average Score
    total_score = sum(item['score'] for item in user_history)
    average_score = round(total_score / total_sessions) if total_sessions > 0 else 0

    # Calculate Streak
    streak = 0
    today = datetime.now().date()
    
    # Extract unique dates and sort them descending
    dates_active = sorted(list(set(item['date'] for item in user_history)), reverse=True)
    
    if dates_active:
        try:
            last_active = datetime.strptime(dates_active[0], "%Y-%m-%d").date()
            
            # Streak only counts if you were active Today or Yesterday
            if last_active == today or last_active == today - timedelta(days=1):
                streak = 1
                current_check = last_active
                
                for i in range(1, len(dates_active)):
                    prev_date = datetime.strptime(dates_active[i], "%Y-%m-%d").date()
                    if prev_date == current_check - timedelta(days=1):
                        streak += 1
                        current_check = prev_date
                    else:
                        break
            else:
                streak = 0
        except ValueError:
            # Handle cases where date format might be wrong in JSON
            streak = 0

    # Weekly Growth Logic
    weekly_growth = 0
    if len(user_history) >= 2:
        # Compare average of last 3 vs previous 3 (or chunks available)
        recent_chunk = user_history[:3]
        old_chunk = user_history[3:6]
        
        avg_recent = sum(h['score'] for h in recent_chunk) / len(recent_chunk)
        
        if old_chunk:
            avg_old = sum(h['score'] for h in old_chunk) / len(old_chunk)
            if avg_old > 0:
                weekly_growth = round(((avg_recent - avg_old) / avg_old) * 100, 1)
        else:
            weekly_growth = 100 # First week growth

    return {
        "total_sessions": total_sessions,
        "average_score": average_score,
        "weekly_growth": weekly_growth,
        "streak": streak,
        "history": user_history 
    }