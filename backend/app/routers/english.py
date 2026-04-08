from fastapi import APIRouter, Form
import google.generativeai as genai
import os
from dotenv import load_dotenv
from app.core.database import db
from datetime import datetime

load_dotenv()
router = APIRouter()


api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

def get_model():
    # 'gemini-1.5-flash' tumhare liye 404 de raha hai.
    # Isliye hum 'gemini-flash-latest' use kar rahe hain.
    return genai.GenerativeModel('models/gemini-flash-latest')

model = get_model()

chat_sessions = {} 

@router.post("/start")
async def start_english_practice(mode: str = Form(...)):
    global chat_sessions
    
    # Mode ke hisaab se instruction
    tone = "formal and professional" if mode == "Professional" else "casual and friendly"
    
    instruction = f"""
    You are an English Voice Tutor. Mode: {mode}. Tone: {tone}.
    
    Rules:
    1. Start a conversation relevant to the mode.
    2. If I make a grammar mistake, start reply with "Correction: [Correct Sentence]", then continue chatting.
    3. Keep responses SHORT (max 2 sentences) for voice chat.
    4. Do not act like a robot.
    """
    
    try:
        chat = model.start_chat(history=[])
        
        response = chat.send_message(instruction + "\nStart the conversation.")
        
        chat_sessions['current_user'] = chat
        
        return {"message": response.text}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@router.post("/chat")
async def chat_english(message: str = Form(...)):
    global chat_sessions
    
    if 'current_user' not in chat_sessions:
        return {"message": "Session expired. Please click 'Professional' or 'Daily' again."}
    
    try:
        chat = chat_sessions['current_user']
        response = chat.send_message(message)
        return {"message": response.text}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@router.post("/end")
async def end_session(email: str = Form(...), mode: str = Form(...)):
    global chat_sessions
    
    if 'current_user' not in chat_sessions:
        return {"message": "No active session to save."}

    try:
        chat = chat_sessions['current_user']
        
        # History extract karo
        full_conversation = ""
        for msg in chat.history:
            role = "User" if msg.role == "user" else "AI"
            full_conversation += f"{role}: {msg.parts[0].text}\n"
        
        # Database mein save
        db.english_practice.insert_one({
            "email": email,
            "mode": mode,
            "conversation": full_conversation,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "timestamp": datetime.now()
        })
        
        # Memory clear karo
        del chat_sessions['current_user']
        
        return {"message": "Session Saved!"}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}