from fastapi import APIRouter, Form, HTTPException
import google.generativeai as genai
import os
import json
import random
from pydantic import BaseModel

router = APIRouter()

DIRECT_API_KEY = os.getenv("GOOGLE_API_KEY")

genai.configure(api_key=DIRECT_API_KEY)


def get_best_model():
    try:
        available_models = []
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                available_models.append(m.name)
        
        preferences = [
            "models/gemini-2.5-flash", 
            "models/gemini-2.5-pro", 
            "models/gemini-2.0-flash", 
            "models/gemini-1.5-flash", 
            "models/gemini-pro"
        ]
        
        for pref in preferences:
            if pref in available_models:
                print(f"✅ Selected Model: {pref}")
                return pref
        
        # Fallback
        if available_models:
            print(f"⚠️ Fallback Model: {available_models[0]}")
            return available_models[0]
            
        return "models/gemini-pro" 
        
    except Exception as e:
        print(f"❌ Error listing models: {e}")
        return "models/gemini-pro"

# Initialize Model
selected_model_name = get_best_model()

generation_config = {
  "temperature": 1.0, 
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
}

model = genai.GenerativeModel(
    model_name=selected_model_name, 
    generation_config=generation_config
)

class QuestionRequest(BaseModel):
    level: str
    count: int

@router.post("/generate-questions")
async def generate_questions(request: QuestionRequest):
    try:
        # --- 1. STRICT LEVEL MAPPING ---
        if request.level == "Fresher":
            allowed_topics = ["Arrays", "Strings", "Basic Math", "Two Pointers", "Simple Loops", "Conditions"]
            difficulty_prompt = "Difficulty: Easy to Medium. Focus on logic building."
            forbidden = "Do NOT ask about Graphs, Dynamic Programming, or Trees."
            
        elif request.level == "Mid":
            allowed_topics = ["Linked Lists", "Stacks", "Queues", "Hash Maps", "Binary Trees", "Sliding Window", "Sorting"]
            difficulty_prompt = "Difficulty: Medium. Focus on Data Structures."
            forbidden = "Do NOT ask extremely hard DP problems."
            
        else: # Senior
            allowed_topics = ["Dynamic Programming", "Graphs (BFS/DFS)", "Backtracking", "Tries", "Heaps", "System Design logic"]
            difficulty_prompt = "Difficulty: Hard. Focus on Optimization."
            forbidden = "Do NOT ask simple Array questions."

        # --- 2. FORCED RANDOMNESS ---
        if len(allowed_topics) >= 2:
            selected_topics = ", ".join(random.sample(allowed_topics, 2))
        else:
            selected_topics = allowed_topics[0]

        random_seed = random.randint(1000, 99999)

        # --- 3. FINAL PROMPT ---
        prompt = f"""
        [Random Seed: {random_seed}]
        Act as a Technical Interviewer. Generate {request.count} UNIQUE coding interview questions.
        
        CONTEXT:
        - Candidate Level: {request.level}
        - Focus Topics: {selected_topics}
        - {difficulty_prompt}
        - Constraint: {forbidden}
        
        OUTPUT FORMAT (Strict JSON):
        Return ONLY a raw JSON object with a key "questions" containing a list.
        Do NOT use Markdown formatting.
        
        Each question object must look like this:
        {{
            "id": (unique integer),
            "title": "Problem Title",
            "desc": "Detailed problem statement...",
            "difficulty": "{request.level}",
            "example": "Input: ... Output: ...",
            "templates": {{
                "cpp": "class Solution {{ ... }}",
                "java": "class Solution {{ ... }}",
                "python": "def solution(...):",
                "javascript": "function solution(...) {{ }}"
            }}
        }}
        """

        response = model.generate_content(prompt)
        
        clean_text = response.text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text[7:]
        if clean_text.endswith("```"):
            clean_text = clean_text[:-3]
            
        data = json.loads(clean_text)
        return data

    except Exception as e:
        print(f"Error Generating Questions: {e}")
        return get_fallback_data(request.level)

def get_fallback_data(level):
    return {"questions": [
        {"id": 1, "title": "Find Max (Offline)", "desc": "Find largest element.", "example": "[1,5] -> 5", "templates": {"cpp": "// Code"}}
    ]}

@router.post("/submit")
async def check_code(code: str = Form(...), language: str = Form(...), question: str = Form(...)):
    try:
        prompt = f"""
        Act as a Code Compiler & Judge.
        Question: {question}
        Language: {language}
        Code:
        {code}

        Verify logic, syntax, and edge cases.
        Output: "STATUS: PASSED (Summary)" or "STATUS: FAILED (Reason)".
        """
        response = model.generate_content(prompt)
        return {"result": response.text}
    except Exception as e:
        return {"result": f"Error: {e}"}