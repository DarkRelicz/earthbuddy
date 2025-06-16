import yfinance as yf

def get_yfinance_info(ticker_symbol: str):
    ticker = yf.Ticker(ticker_symbol)
    info = ticker.info
    return {
        "ticker": ticker_symbol,
        "longName": info.get("longName"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "marketCap": info.get("marketCap"),
    }
