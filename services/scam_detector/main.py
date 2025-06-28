from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SMSInput(BaseModel):
    message: str

@app.get("/")
def root():
    return {"message": "Scam SMS Detection Service Running"}

@app.post("/detect")
def detect_scam(data: SMSInput):
    msg = data.message.lower()
    scam_keywords = ["lottery", "win", "free", "urgent", "click", "account blocked"]
    if any(word in msg for word in scam_keywords):
        return {"scam": True, "confidence": 0.85}
    return {"scam": False, "confidence": 0.10}
