import traceback
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import pytesseract
from PIL import Image
import tempfile
import shutil
import requests
import os
from dotenv import load_dotenv

load_dotenv()


app = FastAPI()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def extract_text_from_image(file_path):
    image = Image.open(file_path)
    text = pytesseract.image_to_string(image, lang='eng')
    return text

def call_llama(prompt):
    if not GROQ_API_KEY:
        return "कोई उत्तर नहीं मिला।"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}"
    }
    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=payload
    )
    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    return "कोई उत्तर नहीं मिला।"

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        extracted_text = extract_text_from_image(tmp_path)
        prompt = f"इस सरकारी दस्तावेज़ को पढ़कर 3 सबसे ज़रूरी बातें सरल हिंदी में समझाइए:\n\n{extracted_text}"
        explanation = call_llama(prompt)

        return JSONResponse({
            "clauses": explanation.strip(),
            "text": extracted_text
        })

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
