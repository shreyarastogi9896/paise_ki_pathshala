import os
import json5  

from pydantic import BaseModel
import json
import traceback
import requests
from fastapi import FastAPI

from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

PROMPT_TEMPLATE = """
You are an intelligent financial assistant. A user (less educated probably) has described her investment needs in Hindi or English. Your task:

1. Extract:
   - Purpose (in Hindi)
   - Time horizon (e.g., 5 साल, 10 साल)
   - Savings Mode (SIP, one-time, RD, etc.)

2. Assign weights (0 to 1, total = 1) to these products:
   - FD
   - RD
   - PPF
   - Mutual Fund
   - Gold 

Input:
"{user_input}"

Return JSON in this format:
{
  "purpose": "...",
  "time_horizon": "...",
  "weights": {
    "FD": ...,
    "RD": ...,
    "PPF": ...,
    "Mutual Fund": ...,
    "Gold": ...
  }
}
"""

class UserInput(BaseModel):
    user_input: str

@app.post("/extract-weights")
def extract_weights(data: UserInput):
    try:
        prompt = PROMPT_TEMPLATE.replace("{user_input}", data.user_input)

        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama3-70b-8192",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }

        response = requests.post("https://api.groq.com/openai/v1/chat/completions",
                                 headers=headers, json=payload)

        if response.status_code == 200:
            content = response.json()['choices'][0]['message']['content']

            # Extract JSON block from GPT response string
            start = content.find('{')
            end = content.rfind('}') + 1
            json_str = content[start:end]

            parsed_json = json5.loads(json_str)
            return parsed_json
        else:
            return {
                "error": "GPT request failed",
                "status_code": response.status_code,
                "details": response.text
            }

    except Exception as e:
        return {
            "error": "Internal Server Error",
            "details": traceback.format_exc()
        }
