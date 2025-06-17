from flask import Flask, request, jsonify
from google import genai
from utils.yfinance import get_esg_scores
from utils.getlogo import fetch_image_url

app = Flask(__name__)

# Initialize the Google Generative AI client
client = genai.Client(api_key="AIzaSyCgJ8yedfM_pF5mNLohrUt6DNuoxTtqsHc")  # Replace with your actual API key

@app.route("/get_ticker", methods=["GET"])
def get_ticker():
    brand_name = request.args.get("brand_name")
    if not brand_name:
        return jsonify({"error": "Missing 'brand_name' parameter"}), 400

    # Generate the ticker symbol using Google Generative AI
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=f"What is the stock ticker symbol for {brand_name} or its parent company? "
                 "Return only the ticker symbol on yfinance, without any additional text."
    )
    ticker = response.text.strip()

    # Fetch ESG score
    try:
        esg_scores = get_esg_scores(ticker)
        image_url = fetch_image_url(brand_name)  # Dynamically fetch image URL
        if esg_scores is None:
            return jsonify({
                "brand_name": brand_name,
                "ticker": ticker,
                "esg_scores": "No ESG data",
                "grade": None,
                "image_url": image_url
            })
        
        # Normalize ESG score to 1 to 5 scale
        grade = int((esg_scores / 41) * 5)
        normalized_esg = max(1, min(5, grade))  # Ensure grade is between 1 and 5

        return jsonify({
            "brand_name": brand_name,
            "ticker": ticker,
            "esg_scores": esg_scores,
            "grade": normalized_esg,
            "image_url": image_url
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)