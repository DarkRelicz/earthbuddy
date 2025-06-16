import requests
import re

def get_wikipedia_summary(brand_name: str):
    search_url = "https://en.wikipedia.org/w/api.php"
    search_params = {
        "action": "query",
        "list": "search",
        "srsearch": brand_name,
        "format": "json"
    }
    search_resp = requests.get(search_url, params=search_params).json()
    if not search_resp["query"]["search"]:
        return None

    page_title = search_resp["query"]["search"][0]["title"]

    summary_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{page_title}"
    summary_resp = requests.get(summary_url).json()

    return summary_resp.get("extract")

def extract_parent_company_name(text: str):
    keywords = ["parent company", "owned by", "subsidiary of", "division of"]
    text_lower = text.lower()
    for kw in keywords:
        if kw in text_lower:
            sentences = text.split(". ")
            for sentence in sentences:
                if kw in sentence.lower():
                    match = re.search(rf"{kw} (?:of )?(.+?)(?:\.|,|$)", sentence, re.IGNORECASE)
                    if match:
                        return match.group(1).strip()
                    else:
                        return sentence.strip()
    return "Parent company info not found"
