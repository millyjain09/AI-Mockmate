import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# 👇 YAHAN APNI WAHI NAYI KEY DIRECT PASTE KARO
DIRECT_API_KEY = "AIzaSyCii_KmiC0UAJXo03HQbqN_6uMfZEVcVjo" 
genai.configure(api_key=DIRECT_API_KEY)

print("📡 Connecting to Google to fetch YOUR available models...\n")

try:
    count = 0
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ AVAILABLE: {m.name}")
            count += 1
    
    if count == 0:
        print("❌ Koi model nahi mila! Key ya Library mein issue hai.")
    else:
        print(f"\n✨ Total {count} models found. Use one of the names above exactly.")

except Exception as e:
    print(f"❌ Error: {e}")