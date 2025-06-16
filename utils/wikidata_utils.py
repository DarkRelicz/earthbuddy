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
    try:
        entity_id = search_wikidata_entity(brand)
        if not entity_id:
            return None
        client = Client()
        entity = client.get(entity_id, load=True)
        
        # Check common ticker properties
        for prop in ['P1810', 'P5137']:  # stock ticker properties
            if prop in entity:
                return entity[prop].text
        
        return None
    except Exception:
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

