from fastapi import FastAPI
from pydantic import BaseModel
from utils.wikidata_utils import get_company_name_from_wikidata, get_ticker_from_wikidata
from utils.yfinance_utils import get_ticker_from_yahoo, get_esg_data_from_yfinance

app = FastAPI()

class BrandRequest(BaseModel):
    brand: str

# Route 1 — resolve ticker
@app.post("/resolve-ticker")
def resolve_ticker(req: BrandRequest):
    ticker = get_ticker_from_wikidata(req.brand)
    if ticker:
        return {"brand": req.brand, "ticker": ticker}

    # fallback to your previous approach
    company = get_company_name_from_wikidata(req.brand)
    if not company:
        return {"brand": req.brand, "error": "Company not found"}

    ticker = get_ticker_from_yahoo(company)
    if not ticker:
        return {"brand": req.brand, "company": company, "error": "Ticker not found"}

    return {"brand": req.brand, "company": company, "ticker": ticker}

# Route 2 — get ESG directly from brand
@app.post("/brand-esg")
def brand_esg(req: BrandRequest):
    company = get_company_name_from_wikidata(req.brand)
    if not company:
        return {"brand": req.brand, "error": "Company not found"}

    ticker = get_ticker_from_yahoo(company)
    if not ticker:
        return {"brand": req.brand, "company": company, "error": "Ticker not found"}

    esg = get_esg_data_from_yfinance(ticker)
    if not esg:
        return {"brand": req.brand, "company": company, "ticker": ticker, "error": "ESG data not found"}

    return {
        "brand": req.brand,
        "company": company,
        "ticker": ticker,
        "esg": esg
    }
