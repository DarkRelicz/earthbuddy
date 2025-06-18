import requests

def fetch_image_url(brand_name):
    """
    Fetch the logo icon URL for a given brand using Brandfetch API.

    Args:
        brand_name (str): The name of the brand.

    Returns:
        str: The logo icon URL or a fallback message if unavailable.
    """
    brand_name = brand_name.lower() # Format brand name for URL
    client_id = "your_client_id"  # Replace with your actual Brandfetch client ID
    return f"https://cdn.brandfetch.io/{brand_name}.com?c={client_id}"
    # response = requests.get(url)
    # if response.status_code == 200:
    #     data = response.json()
    #     if len(data) > 0 and "icon" in data[0]:  # Check if the first brand has an icon
    #         return data[0]["icon"]  # Return the icon URL of the first brand
    # return "No image available"