import requests
import yfinance as yf

def get_esg_scores(ticker: str):
    """
    Fetch ESG scores for a given ticker symbol using yfinance.

    Args:
        ticker (str): The stock ticker symbol.

    Returns:
        dict: A dictionary containing ESG scores, or None if no data is available.
    """
    try:
        stock = yf.Ticker(ticker)
        esg_data = stock.sustainability
        if esg_data is None:
            return None
        return esg_data.to_dict()  # Convert pandas DataFrame to dictionary
    except Exception as e:
        raise Exception(f"Failed to fetch ESG scores for ticker '{ticker}': {e}")
