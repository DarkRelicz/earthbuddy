import requests

def get_parent_company(brand_name: str):
    query = f"""
    SELECT ?company ?companyLabel WHERE {{
      ?brand rdfs:label "{brand_name}"@en.
      ?brand wdt:P749 ?company.
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    LIMIT 1
    """
    url = "https://query.wikidata.org/sparql"
    headers = {"Accept": "application/sparql-results+json"}
    response = requests.get(url, params={"query": query}, headers=headers)
    data = response.json()

    results = data.get("results", {}).get("bindings", [])
    if results:
        company_name = results[0]["companyLabel"]["value"]
        company_url = results[0]["company"]["value"]
        return company_name, company_url
    return None, None
