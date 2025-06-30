from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
import pandas as pd
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

# Load precomputed mutual funds (already sorted by predicted_5yr)
df_sorted = pd.read_csv("predicted_mutual_funds.csv")

# --- CONFIG ---
GROQ_URL = "http://product_weight_service:8005/extract-weights"
SENTIMENT_URL = "http://news-sentiment-api:8006/check-news-products"  # Adjust ports as per your docker setup

# --- MODELS ---
class UserText(BaseModel):
    user_input: str

# --- ROUTE ---
@app.post("/investment-guide")
def investment_guide(data: UserText):
    try:
        # 1. Call Groq Weights Service
        groq_resp = requests.post(GROQ_URL, json={"user_input": data.user_input})
        if groq_resp.status_code != 200:
            raise Exception("Groq service failed")
        user_data = groq_resp.json()

        base_weights = user_data.get("weights", {})
        purpose = user_data.get("purpose")
        time_horizon = user_data.get("time_horizon")

        # 2. Call Sentiment Adjuster Service
        sent_resp = requests.get(SENTIMENT_URL)
        if sent_resp.status_code != 200:
            raise Exception("Sentiment service failed")
        sentiments = sent_resp.json().get("product_sentiments", {})

        # 3. Adjust weights ↓↓
        adjusted = {}
        for product, weight in base_weights.items():
            sentiment = sentiments.get(product)
            if sentiment == "negative":
                weight *= 0.7
            elif sentiment == "positive":
                weight *= 1.1
            adjusted[product] = weight

        # Normalize
        total = sum(adjusted.values())
        if total > 0:
            adjusted = {k: round(v / total, 3) for k, v in adjusted.items()}
        else:
            adjusted = base_weights  # fallback

        # 4. If MF weight > 0.1, suggest mutual funds
        fund_recos = []
        if adjusted.get("Mutual Fund", 0) > 0.1:
            fund_recos = df_sorted.head(5).to_dict(orient="records")

        # 5. Return Combined Result
        return {
            "purpose": purpose,
            "time_horizon": time_horizon,
            "adjusted_weights": adjusted,
            "mutual_fund_suggestions": fund_recos
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
