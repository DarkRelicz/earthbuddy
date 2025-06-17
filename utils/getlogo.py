import requests

def fetch_image_url(brand_name):
    """
    Fetch the logo icon URL for a given brand using Brandfetch API.

    Args:
        brand_name (str): The name of the brand.

    Returns:
        str: The logo icon URL or a fallback message if unavailable.
    """
    API_KEY = "your_brandfetch_api_key"  # Replace with your actual Brandfetch API key
    url = f"https://api.brandfetch.io/v2/search/{brand_name}"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if len(data) > 0 and "icon" in data[0]:  # Check if the first brand has an icon
            return data[0]["icon"]  # Return the icon URL of the first brand
    return "No image available"