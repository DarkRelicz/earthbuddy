from flask import Flask, request, jsonify
from google import genai

app = Flask(__name__)

# Initialize the Google Generative AI client
client = genai.Client(api_key="AIzaSyDaPY9gtw1kxO7yDXeyfc-du51tpdlYsGg")  # Replace with your actual API key

@app.route("/get_ticker", methods=["GET"])
def get_ticker():
    brand_name = request.args.get("brand_name")
    if not brand_name:
        return jsonify({"error": "Missing 'brand_name' parameter"}), 400

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=f"What is the stock ticker symbol for {brand_name} or its parent company? "
                 "Return only the ticker symbol, without any additional text."
    )
    ticker = response.text.strip()
    return jsonify({"brand_name": brand_name, "ticker": ticker})

if __name__ == "__main__":
    app.run(debug=True)