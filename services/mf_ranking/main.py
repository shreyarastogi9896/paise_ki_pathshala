from fastapi import FastAPI, Query
import pandas as pd

app = FastAPI()

# Load precomputed and sorted mutual fund predictions
df_sorted = pd.read_csv("predicted_mutual_funds.csv")  # Ensure this CSV is already sorted by predicted_5yr

@app.get("/top-mutual-funds")
def top_mutual_funds(n: int = Query(5, ge=1, le=20)):
    return {
        "top_funds": df_sorted.head(n).to_dict(orient="records")
    }
