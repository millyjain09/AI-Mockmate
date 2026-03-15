from fastapi import APIRouter, Form, UploadFile, File
import google.generativeai as genai
import os
from pypdf import PdfReader
from dotenv import load_dotenv
from app.core.database import db
from datetime import datetime
import re

load_dotenv()
router = APIRouter()

# 👇 SECURITY NOTE: Never share your real API key in public code!
# I have kept your variable name, but ensure this is secure in production.
DIRECT_API_KEY = "YOUR_API_KEY_HERE" 
genai.configure(api_key=DIRECT_API_KEY)

# 👇 MODEL SETUP
def get_chat_model():
    return genai.GenerativeModel('models/gemini-flash-latest')

model = get_chat_model()
# Global variables (Note: specific to single-user local testing)
chat_session = None 
resume_text = ""

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    global resume_text
    try:
        pdf = PdfReader(file.file)
        text = ""
        for page in pdf.pages: text += page.extract_text()
        resume_text = text
        return {"message": "Resume analyzed successfully! ✅"}
    except: return {"message": "Error reading resume"}

# 👇 THIS IS THE UPDATED FUNCTION
@router.post("/start")
async def start_interview(
    topic: str = Form(...), 
    level: str = Form(...), 
    mode: str = Form(...), # Expecting "Practice" or "Real"
    total_questions: int = Form(...) 
):
    global chat_session, resume_text
    
    chat_session = model.start_chat(history=[])
    
    # Base instruction
    base_instruction = f"""
    You are an expert Technical Interviewer. 
    Topic: {topic}. Difficulty Level: {level}. 
    Total Questions to ask: {total_questions}.
    
    Current Resume Context: {resume_text if resume_text else "No resume provided."}
    """

    # 👇 LOGIC FOR MODES
    if mode.lower() == "practice":
        # Practice Mode: Feedback immediately after every answer
        mode_instruction = """
        MODE: PRACTICE / MENTOR MODE.
        1. Ask exactly ONE question at a time.
        2. Wait for the user's answer.
        3. AFTER the user answers, provide IMMEDIATE brief feedback (correct/incorrect) and a tip.
        4. THEN ask the next question.
        """
    else:
        # Real Mode: No feedback, strictly professional
        mode_instruction = """
        MODE: REAL MOCK INTERVIEW.
        1. Ask exactly ONE question at a time.
        2. Wait for the user's answer.
        3. Do NOT provide feedback, validation, or correct answers. 
        4. Simply acknowledge (e.g., "Okay", "Noted") and move to the next question immediately.
        5. Maintain a neutral, professional tone.
        """

    final_prompt = base_instruction + "\n" + mode_instruction + "\nStart by asking Question 1."

    try:
        response = chat_session.send_message(final_prompt)
        return {"message": response.text}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@router.post("/chat")
async def chat(answer: str = Form(...)):
    global chat_session
    if not chat_session: return {"message": "Session expired."}
    
    try:
        # In 'Practice' mode, this response will contain feedback + next question.
        # In 'Real' mode, this response will just be the next question.
        response = chat_session.send_message(answer)
        return {"message": response.text}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@router.post("/end")
async def end_interview(email: str = Form(...), topic: str = Form(...)):
    global chat_session
    if not chat_session: return {"message": "No active session."}
    try:
        # This prompts the AI to generate the final Result Page content
        response = chat_session.send_message(
            "The interview is over. Stop asking questions. "
            "Analyze my previous answers based on the mode we selected. "
            "Provide a comprehensive feedback report and a final SCORE (0-100)."
        )
        full_text = response.text

        score = 50
        match = re.search(r"SCORE:\s*(\d+)", full_text, re.IGNORECASE)
        if match: score = int(match.group(1))

        # Database Save
        db.interviews.insert_one({
            "email": email, "topic": topic, "score": score,
            "feedback": full_text, 
            "date": datetime.now().strftime("%d %b %Y, %I:%M %p"),
            "timestamp": datetime.now()
        })
        return {"message": full_text}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@router.get("/stats/{email}")
async def get_dashboard_stats(email: str):
    try:
        total = db.interviews.count_documents({"email": email})
        
        pipeline = [
            {"$match": {"email": email}},
            {"$group": {"_id": None, "avg_score": {"$avg": "$score"}}}
        ]
        avg_cursor = list(db.interviews.aggregate(pipeline))
        avg_score = int(avg_cursor[0]["avg_score"]) if avg_cursor else 0
        
        history = list(db.interviews.find({"email": email}, {"_id": 0}).sort("timestamp", -1).limit(5))
        
        return {
            "total_interviews": total,
            "average_score": avg_score,
            "recent_history": history
        }
    except Exception as e:
        return {"error": str(e), "total_interviews": 0, "average_score": 0, "recent_history": []}

