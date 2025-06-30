from fastapi import FastAPI, Query
from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv
import time
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")
HF_API_URL = "https://api-inference.huggingface.co/models/ProsusAI/finbert"
headers = {"Authorization": f"Bearer {HF_API_KEY}"}


def get_google_news_rss(query):
    try:
        query = query.replace(" ", "+")
        url = f"https://news.google.com/rss/search?q={query}&hl=en-IN&gl=IN&ceid=IN:en"
        res = requests.get(url, timeout=10)
        soup = BeautifulSoup(res.content, "xml")
        items = soup.find_all("item")
        return [item.title.text.strip() for item in items[:5]]
    except Exception as e:
        print(f"Error fetching news for {query}: {e}")
        return []
    
def get_sentiment(text):
    payload = {"inputs": text}
    try:
        res = requests.post(HF_API_URL, headers=headers, json=payload, timeout=15)
        output = res.json()
        print("HF API Response:", output)

        if isinstance(output, list) and len(output) > 0:
            inner = output[0]  # This is the inner list
            if isinstance(inner, list) and len(inner) > 0:
                top_label = max(inner, key=lambda x: x["score"])
                return top_label["label"].lower()
    except Exception as e:
        print(f"Sentiment API error: {e}")
    return None



@app.get("/check-news-products")
def check_product_sentiment():
    products = {
        "Mutual Fund": "mutual fund",
        "PPF": "PPF interest",
        "FD": "FD rates",
        "RD": "recurring deposit",
        "Gold": "gold investment"
    }

    result = {}
    details = []

    for product, query in products.items():
        headlines = get_google_news_rss(query)
        group_text = ". ".join(headlines)
        sentiment = get_sentiment(group_text)
        result[product] = sentiment
        details.append({
            "product": product,
            "headlines": headlines,
            "sentiment": sentiment
        })
        time.sleep(1)

    return {"product_sentiments": result, "details": details}

@app.get("/test-sentiment")
def test_sentiment(text: str = Query(..., description="Enter any finance news or sentence")):
    try:
        sentiment = get_sentiment(text)
        if sentiment:
            return {"text": text, "sentiment": sentiment}
        else:
            return {"text": text, "sentiment": "unknown", "error": "Could not determine sentiment"}
    except Exception as e:
        return {
            "text": text,
            "sentiment": "error",
            "error": str(e)
        }
