from fastapi import FastAPI
from pydantic import BaseModel
from wiki_utils import get_wikipedia_summary, extract_parent_company_name
from yf_utils import get_yfinance_info

app = FastAPI()

class BrandRequest(BaseModel):
    brand: str

class TickerRequest(BaseModel):
    ticker: str

@app.post("/wiki-parent")
def wiki_parent(request: BrandRequest):
    summary = get_wikipedia_summary(request.brand)
    if not summary:
        return {"brand": request.brand, "error": "Brand page not found on Wikipedia"}

    parent_name = extract_parent_company_name(summary)
    return {"brand": request.brand, "parent_company": parent_name}

@app.post("/yfinance-data")
def yfinance_data(request: TickerRequest):
    data = get_yfinance_info(request.ticker)
    return data
