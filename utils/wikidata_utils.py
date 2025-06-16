from wikidata.client import Client

def get_company_name_from_wikidata(brand: str) -> str | None:
    try:
        client = Client()
        entity = client.search(brand)[0]
        data = client.get(entity.id, load=True)

        if "P127" in data:
            return data["P127"].label.text

        return data.label.text
    except Exception:
        return None

def get_ticker_from_wikidata(brand: str) -> str | None:
    client = Client()
    results = client.search(brand)
    if not results:
        return None
    
    entity = client.get(results[0].id, load=True)
    
    # Check common ticker properties
    for prop in ['P1810', 'P5137']:
        if prop in entity:
            return entity[prop].text

    # fallback: sometimes ticker stored as qualifier in P414 (stock exchange)
    # or you may want to parse other properties
    
    return None