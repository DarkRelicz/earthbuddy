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
