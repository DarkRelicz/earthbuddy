import json
import urllib.request
import urllib.parse
import os

"""
See https://www.openfigi.com/api for more information.

This script is written to be run by python3 - tested with python3.12 - without any external libraries.
"""

JsonType = None | int | str | bool | list["JsonType"] | dict[str, "JsonType"]

# Set your OpenFIGI API key here or in an environment variable
OPENFIGI_API_KEY = os.environ.get("024ace3e-1409-4795-8120-85d0f8ea7e6e", None)
OPENFIGI_BASE_URL = "https://api.openfigi.com"


def api_call(
    path: str,
    data: dict | None = None,
    method: str = "POST",
) -> JsonType:
    """
    Make an API call to `api.openfigi.com`.

    Args:
        path (str): API endpoint, for example "search" or "mapping".
        method (str, optional): HTTP request method. Defaults to "POST".
        data (dict | None, optional): HTTP request data. Defaults to None.

    Returns:
        JsonType: Response of the API call parsed as a JSON object.
    """
    headers = {"Content-Type": "application/json"}
    if OPENFIGI_API_KEY:
        headers["X-OPENFIGI-APIKEY"] = OPENFIGI_API_KEY

    request = urllib.request.Request(
        url=urllib.parse.urljoin(OPENFIGI_BASE_URL, path),
        data=data and bytes(json.dumps(data), encoding="utf-8"),
        headers=headers,
        method=method,
    )

    with urllib.request.urlopen(request) as response:
        json_response_as_string = response.read().decode("utf-8")
        json_obj = json.loads(json_response_as_string)
        return json_obj


def main():
    """
    Query OpenFIGI for Fast Retailing's ticker symbol and print only the ticker.
    """
    # Example 1: Search for "Fast Retailing"
    search_request = {"query": "FAST RETAILING"}
    print("Making a search request:", search_request)

    try:
        search_response = api_call("/v3/search", search_request)
    except Exception as e:
        print(f"Error during API call: {e}")
        return

    # Debug: Print the full response
    print("Search Response:", json.dumps(search_response, indent=2))

    # Extract and print the ticker symbol from the search response
    ticker = None
    if search_response and isinstance(search_response, list):
        for result in search_response:
            if "ticker" in result:
                ticker = result["ticker"]
                print(f"Ticker: {ticker}")
                break
        else:
            print("Ticker not found in search response.")
    else:
        print("Search response is empty or invalid.")

    # Final output
    if ticker:
        print(f"Final ticker: {ticker}")
    else:
        print("No ticker found.")
        
if __name__ == "__main__":
    main()