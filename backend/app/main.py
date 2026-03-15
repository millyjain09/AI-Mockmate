
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 👇 Imports
from app.routers import auth, interview, dashboard, code_eval, english 

app = FastAPI(title="AI Interviewer Pro")

origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://ai-mockmate-flax.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTERS ---
# 1. Auth
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# 2. Interview Logic 
app.include_router(interview.router, prefix="/interview", tags=["Interview Logic"])

# 3. Dashboard
# 👇 FIX: Maine yahan se prefix="/dashboard" hata diya hai. 
# Kyunki tumhare dashboard.py file mein pehle se hi "@router.get('/dashboard/...')" likha hua hai.
app.include_router(dashboard.router, tags=["Dashboard"]) 

# 4. Others
app.include_router(code_eval.router, prefix="/code", tags=["Code Evaluation"])
app.include_router(english.router, prefix="/english", tags=["English"])

@app.get("/")
def home():
    return {"message": "Welcome to AI Interviewer Pro API 🚀"}