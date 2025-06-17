import requests

def get_ticker_from_brand(brand: str) -> str | None:
    try:
        # Step 1: Search for entity ID using brand name
        search_url = "https://www.wikidata.org/w/api.php"
        params = {
            "action": "wbsearchentities",
            "search": brand,
            "language": "en",
            "format": "json",
            "limit": 1,
        }
        response = requests.get(search_url, params=params)
        response.raise_for_status()
        search_data = response.json()
        
        if not search_data.get("search"):
            print(f"No search results found for brand: {brand}")
            return None

        entity_id = search_data["search"][0]["id"]
        print(f"Found QID for '{brand}': {entity_id}")  # Debugging

        # Step 2: Fetch entity data using QID
        entity_url = f"https://www.wikidata.org/wiki/Special:EntityData/{entity_id}.json"
        response = requests.get(entity_url)
        response.raise_for_status()
        entity_data = response.json()
        claims = entity_data.get("entities", {}).get(entity_id, {}).get("claims", {})

        # Step 3: Look for ticker symbol (P249)
        if "P249" in claims:
            ticker = claims["P249"][0]["mainsnak"]["datavalue"]["value"]
            print(f"Ticker symbol for '{brand}' (QID: {entity_id}): {ticker}")  # Debugging
            return ticker

        # Step 4: Check for parent company (P127)
        if "P127" in claims:
            parent_id = claims["P127"][0]["mainsnak"]["datavalue"]["value"]["id"]
            print(f"Found parent company QID for '{brand}': {parent_id}")  # Debugging

            # Fetch parent company data
            parent_url = f"https://www.wikidata.org/wiki/Special:EntityData/{parent_id}.json"
            response = requests.get(parent_url)
            response.raise_for_status()
            parent_data = response.json()
            parent_claims = parent_data.get("entities", {}).get(parent_id, {}).get("claims", {})

            # Look for ticker symbol in parent company
            if "P249" in parent_claims:
                ticker = parent_claims["P249"][0]["mainsnak"]["datavalue"]["value"]
                print(f"Ticker symbol for parent company of '{brand}' (Parent QID: {parent_id}): {ticker}")  # Debugging
                return ticker

        print(f"No ticker symbol found for brand: {brand} or its parent company.")
        return None

    except requests.exceptions.RequestException as e:
        print(f"HTTP error occurred: {e}")
        return None
    except KeyError as e:
        print(f"Key error occurred: {e}")
        return None