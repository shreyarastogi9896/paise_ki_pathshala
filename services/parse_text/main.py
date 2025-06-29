import json
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx, os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


class ParseRequest(BaseModel):
    sentence: str

prompt_template = """
तुम एक स्मार्ट खर्च विश्लेषक हो।
यह वाक्य पढ़ो: "{sentence}"
इसमें से खर्च की जानकारी JSON में निकालो जैसे:
{{
  "amount": राशि (₹ में),
  "category": "food" | "transport" | "health" | "education" | "others",
  "date": आज की तारीख (YYYY-MM-DD में)
}}
सिर्फ JSON लौटाओ। No explanation. No extra text. pure JSON format.
"""

@app.post("/parse")
async def parse_text(req: ParseRequest):
    prompt = prompt_template.format(sentence=req.sentence)

    payload = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(GROQ_URL, json=payload, headers=headers)
        result = response.json()
        answer = result['choices'][0]['message']['content']
        try:
            data = json.loads(answer)
    
            data["date"] = datetime.today().strftime("%Y-%m-%d")
            return data
        
        except json.JSONDecodeError as e:
            return {"error": "Invalid JSON format", "raw_output": answer}
