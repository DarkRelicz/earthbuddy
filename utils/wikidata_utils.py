import requests

def search_wikidata_entity(query: str) -> str | None:
    url = "https://www.wikidata.org/w/api.php"
    params = {
        "action": "wbsearchentities",
        "search": query,
        "language": "en",
        "format": "json",
        "limit": 1,
    }
    response = requests.get(url, params=params)
    data = response.json()
    if "search" in data and len(data["search"]) > 0:
        return data["search"][0]["id"]  # returns entity ID like Q12345
    return None

from wikidata.client import Client

def get_ticker_from_wikidata(brand: str) -> str | None:
    client = Client()
    entity_id = search_wikidata_entity(brand)
    if not entity_id:
        return None

    entity = client.get(entity_id, load=True)

    # Step 1: Check parent company (P127)
    if "P127" in entity:
        parent = entity["P127"]
        parent_data = client.get(parent.id, load=True)
    else:
        parent_data = entity

    # Step 2: Try ticker-related properties (P414: stock exchange, P249: ticker)
    if "P414" in parent_data and "P249" in parent_data:
        return parent_data["P249"].text

    # Some companies just have P249
    if "P249" in parent_data:
        return parent_data["P249"].text

    return None

def get_company_name_from_wikidata(brand: str) -> str | None:
    try:
        client = Client()
        entity_id = search_wikidata_entity(brand)
        if not entity_id:
            return None
        entity = client.get(entity_id, load=True)
        
        # Check if entity has parent company (P127)
        if "P127" in entity:
            return entity["P127"].label.text
        
        # Otherwise return the entity label itself (company name)
        return entity.label.text
    except Exception:
        return None

