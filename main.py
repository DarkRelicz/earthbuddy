# from fastapi import FastAPI
# import yfinance as yf

# app = FastAPI()

# @app.get("/esg/{ticker}")
# def get_esg(ticker: str):
#     ticker_obj = yf.Ticker(ticker)
#     esg_data = ticker_obj.sustainability
#     if esg_data is not None:
#         return esg_data.to_dict()
#     else:
#         return {"error": "No ESG data found"}

from fastapi import FastAPI
from pydantic import BaseModel
from wikidata_lookup import get_parent_company

app = FastAPI()

class BrandRequest(BaseModel):
    brand: str

@app.post("/lookup-company")
def lookup_company(request: BrandRequest):
    company, url = get_parent_company(request.brand)
    if company:
        return {"brand": request.brand, "company": company, "wikidata_url": url}
    else:
        return {"brand": request.brand, "error": "No parent company found"}
