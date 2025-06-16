import requests
import yfinance as yf

def get_ticker_from_yahoo(company_name: str) -> str | None:
    try:
        url = "https://query2.finance.yahoo.com/v1/finance/search"
        params = {"q": company_name}
        headers = {"User-Agent": "Mozilla/5.0"}

        res = requests.get(url, headers=headers, params=params)
        data = res.json()

        for item in data.get("quotes", []):
            if item.get("quoteType") == "EQUITY":
                return item.get("symbol")
        return None
    except Exception:
        return None

def get_esg_data_from_yfinance(ticker: str) -> dict | None:
    try:
        stock = yf.Ticker(ticker)
        info = stock.sustainability
        if info is not None:
            return info.to_dict()
        return None
    except Exception:
        return None
