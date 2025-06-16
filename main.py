from fastapi import FastAPI
import yfinance as yf

app = FastAPI()

@app.get("/esg/{ticker}")
def get_esg(ticker: str):
    ticker_obj = yf.Ticker(ticker)
    esg_data = ticker_obj.sustainability
    if esg_data is not None:
        return esg_data.to_dict()
    else:
        return {"error": "No ESG data found"}