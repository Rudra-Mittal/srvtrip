import requests
import json
from flask import Flask, request, jsonify
import os


# Initialize Flask App
app = Flask(__name__)

# Groq API Configuration
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = GROQ_API_KEY = os.getenv("GROQ_API_KEY") # Replace with your actual API key

# Function to summarize reviews using Groq API
def summarize_reviews(place_name, reviews):
    if not reviews:
        return f"No reviews found for {place_name}."

    system_prompt = (
        "You are an AI assistant that summarizes reviews for places. "
        "Given a list of user reviews, generate a concise and insightful summary "
        "highlighting common themes (positive and negative) in 50 sentences."
    )

    user_prompt = f"Reviews for {place_name}: {reviews}\nProvide a 50 lines summary:"

    try:
        response = requests.post(
            GROQ_API_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "mixtral-8x7b-32768",  # or "llama3-8b-8192"
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.7,
            },
        )
        
        response_data = response.json()
        
        if response.status_code != 200:
            return f"API Error: {response_data.get('error', 'Unknown error')}"

        summary = response_data["choices"][0]["message"]["content"]
        return summary

    except Exception as e:
        return f"Error generating summary: {str(e)}"

# Home Route to Avoid 404
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AI Server is running. Use POST /get_summary to get summaries."})

# Ignore favicon requests from browsers
@app.route("/favicon.ico")
def favicon():
    return "", 204

# Flask Route: Get summarized reviews from a file or JSON
@app.route('/get_summary', methods=['POST'])
def get_summary():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON format"}), 400

        place_name = data.get("place")
        if not place_name:
            return jsonify({"error": "Missing place name"}), 400

        # Load the scraped reviews from a file (Modify this path if needed)
        try:
            with open("scraped_reviews.json", "r", encoding="utf-8") as file:
                scraped_data = json.load(file)
        except FileNotFoundError:
            return jsonify({"error": "Scraped reviews file not found"}), 400

        # Find reviews for the requested place
        reviews = next((entry["reviews"] for entry in scraped_data if entry["place"] == place_name), None)

        if not reviews:
            return jsonify({"error": f"No reviews found for {place_name}"}), 400

        summary = summarize_reviews(place_name, reviews)
        return jsonify({"place": place_name, "summary": summary})

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
