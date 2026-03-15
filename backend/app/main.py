# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# # 👇 Saare routers ek saath clean tarike se import karo
# from app.routers import auth, interview, dashboard, code_eval, english

# app = FastAPI(title="AI Interviewer Pro")

# origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- ROUTERS ---
# app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# app.include_router(interview.router, prefix="/interview", tags=["Interview Logic"])

# # 👇 CRITICAL FIX: Prefix '/interview' rakha hai taaki Frontend ka URL match ho jaye.
# # (Frontend call: http://localhost:8000/interview/stats/{email})
# app.include_router(dashboard.router, prefix="/interview", tags=["Dashboard"]) 

# app.include_router(code_eval.router, prefix="/code", tags=["Code Evaluation"])
# app.include_router(english.router, prefix="/english", tags=["English"])

# @app.get("/")
# def home():
#     return {"message": "Welcome to AI Interviewer Pro API 🚀"}


# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# # 👇 FIX: 'routers' ke aage 'app.' lagana zaroori hai
# from app.routers import auth, interview, dashboard, code_eval, english 

# app = FastAPI(title="AI Interviewer Pro")

# origins = [
#     "http://localhost:5173", 
#     "http://127.0.0.1:5173"
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- ROUTERS ---
# app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# app.include_router(interview.router, prefix="/interview", tags=["Interview Logic"])
# app.include_router(interview.router, tags=["Interview"]) # 👈 Prefix hataya kyunki interview.py mein already "/interview/..." likha hai
# app.include_router(dashboard.router, tags=["Dashboard"]) 
# app.include_router(code_eval.router, prefix="/code", tags=["Code Evaluation"])
# app.include_router(english.router, prefix="/english", tags=["English"])

# @app.get("/")
# def home():
#     return {"message": "Welcome to AI Interviewer Pro API 🚀"}


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 👇 Imports
from app.routers import auth, interview, dashboard, code_eval, english 

app = FastAPI(title="AI Interviewer Pro")

origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173"
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