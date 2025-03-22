import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("🚨 Missing GROQ_API_KEY in .env file!")

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Initialize Groq API client
client = Groq(api_key=GROQ_API_KEY)

# Predefined responses for basic chatbot queries
RESPONSES = {
    "hello": "Hi there! How can I help you?",
    "how are you": "I'm just a bot, but I'm doing great!",
    "bye": "Goodbye! Have a nice day!",
}

@app.route("/get_message", methods=["GET"])
def get_message():
    """Send an initial message when the chatbot loads."""
    return jsonify({"message": "Welcome! Ask me about plant diseases."})

def generate_response(conversation_history):
    """Handles long responses by continuing if truncated."""
    response = client.chat.completions.create(
        model="gemma2-9b-it",
        messages=conversation_history,
        temperature=0.7,
        max_tokens=256,
        top_p=1.0,
        stream=False
    )
    
    bot_response = response.choices[0].message.content

    # If response is cut off, ask Groq to continue
    while response.choices[0].finish_reason == "length":
        print("Response cut off, continuing...")
        conversation_history.append({"role": "assistant", "content": bot_response})
        conversation_history.append({"role": "user", "content": "Please continue."})
        
        response = client.chat.completions.create(
            model="gemma2-9b-it",
            messages=conversation_history,
            temperature=0.7,
            max_tokens=1024,
            top_p=1.0,
            stream=False
        )
        
        bot_response += " " + response.choices[0].message.content  # Append new text

    return bot_response

import re

def clean_response(text):
    """Remove Markdown formatting (*, _, -) and extra spaces."""
    text = re.sub(r"[*_`]", "", text)  # Remove *, _, ` symbols
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces
    text = text.replace("\n", " ")  # Replace new lines with spaces for better display
    return text

@app.route("/chat", methods=["POST"])
def chat():
    """Receive user input and return a response (predefined or AI-generated)."""
    data = request.json
    user_message = data.get("message", "").lower()

    if user_message in RESPONSES:
        bot_response = RESPONSES[user_message]
    else:
        conversation_history = [
            {"role": "system", "content": "You are a plant and fruit disease expert. Provide detailed advice on plant diseases, symptoms, causes, and treatments when asked and when casually greeted dont send long responses."},
            {"role": "user", "content": user_message},
        ]

        bot_response = generate_response(conversation_history)

    # Clean response before sending it to frontend
    bot_response = clean_response(bot_response)

    print(f"User: {user_message}\nBot: {bot_response}\n" + "-"*50)
    return jsonify({"response": bot_response})



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
