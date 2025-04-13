import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from groq import Groq
from PIL import Image
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from fuzzy_lookup import lookup_disease_info
from collections import defaultdict
import mysql.connector

db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="12345",
    database="plantbot",
    port=3307,
    unix_socket=''
)


load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("🚨 Missing GROQ_API_KEY in .env file!")

app = Flask(__name__, static_folder="pages")
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


client = Groq(api_key=GROQ_API_KEY)

RESPONSES = {
    "hello": "Hi there! How can I help you?",
    "how are you": "I'm just a bot, but I'm doing great!",
    "bye": "Goodbye! Have a nice day!",
}

chat_histories = defaultdict(list)

fruit_model = load_model("C:/Projects/model/models/fruit_finetuned.h5")
leaf_model = load_model("C:/Projects/model/models/vgg16_plant_disease_finetuned.h5")

fruit_train_dir = "C:/Projects/model/datasets/fruit_split/train"
leaf_train_dir = "C:/Projects/model/datasets/new-plant-diseases-dataset/train"

fruit_class_names = [classes for classes in os.listdir(fruit_train_dir)]
leaf_class_names = [classes for classes in os.listdir(leaf_train_dir)]

def store_message(user_id, sender, message):
    cursor = db.cursor()
    query = """
        INSERT INTO messages (user_id, sender, message)
        VALUES (%s, %s, %s)
    """
    cursor.execute(query, (user_id, sender, message))
    db.commit()
    cursor.close()

@app.route("/clear_chat", methods=["POST"])
def clear_chat():
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    try:
        cur = db.cursor()
        cur.execute("DELETE FROM messages WHERE user_id = %s", (user_id,))
        db.commit()  # use db, not conn
        cur.close()
        return jsonify({"message": "Chat history cleared."})
    except Exception as e:
        print("Error clearing chat:", e)
        return jsonify({"error": "Failed to clear chat"}), 500


@app.route("/history", methods=["POST"])
def fetch_history():
    data = request.json
    session_id = data.get("session_id")

    cursor = db.cursor(dictionary=True)
    query = """
        SELECT sender, message FROM messages
        WHERE user_id = %s
        ORDER BY timestamp ASC
    """
    cursor.execute(query, (session_id,))
    history = cursor.fetchall()
    cursor.close()

    return jsonify(history)



@app.route("/get_message", methods=["GET"])
def get_message():
    return jsonify({"message": "Welcome! Ask me about plant diseases."})

def generate_response(conversation_history):
    response = client.chat.completions.create(
        model="gemma2-9b-it",
        messages=conversation_history,
        temperature=0.7,
        max_tokens=256,
        top_p=1.0,
        stream=False
    )
    
    bot_response = response.choices[0].message.content

    while response.choices[0].finish_reason == "length":
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
        
        bot_response += " " + response.choices[0].message.content

    return bot_response

def is_disease_query(message):
    system_msg = {
        "role": "system",
        "content": (
            "You're a classifier. Given a user's message, respond with only 'yes' if it looks like quering about a "
            "plant diseases (symptoms, treatment, cure, causes, etc.) or looks like a followup, or 'no' otherwise."
        )
    }
    user_msg = {"role": "user", "content": message}

    response = client.chat.completions.create(
        model="gemma2-9b-it",
        messages=[system_msg, user_msg],
        temperature=0,
        max_tokens=5
    )
    result = response.choices[0].message.content.strip().lower()
    return result.startswith("yes")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    session_id = data.get("session_id", "default")
    bot_response = "Sorry, I had trouble retrieving info. Try again!"

    if session_id not in chat_histories:
        chat_histories[session_id] = []


    # Store user's message
    store_message(session_id, "user", user_message)

    chat_histories[session_id].append({"role": "user", "content": user_message})

    if user_message in RESPONSES:
        bot_response = RESPONSES[user_message]
    elif is_disease_query(user_message):
        try:
            result = lookup_disease_info(user_message)
            print(result)
            print(user_message)
            if result:
                bot_response = (
                    f"**{result['Disease']}** was detected in **{result['Plant']}**.\n\n"
                    f"🔍 **Symptoms**: {result['Symptom']}\n\n"
                    f"🦠 **Cause**: {result['Cause']}\n\n"
                    f"💬 **Comment**: {result['Comment']}\n\n"
                    f"🛠️ **Management**: {result['Management']}"
                )
                chat_histories[session_id].append({"role": "user", "content": user_message})
                chat_histories[session_id].append({"role": "assistant", "content": bot_response})
            else:
                conversation_history = [
                    {"role": "system", "content": (
                        "You are a plant disease expert. Always provide the disease name in **bold**, "
                        "list symptoms, and suggest treatments. Use bullet points when helpful."
                    )},
                    {"role": "user", "content": user_message}
                ]
                bot_response = generate_response(conversation_history)
        except Exception as e:
            print("🚨 Error during disease info fetch:", e)
            bot_response = "Sorry, I had trouble retrieving info. Try again!"
    else:
        chat_histories[session_id].append({"role": "user", "content": user_message})
        bot_response = generate_response(chat_histories[session_id])
        chat_histories[session_id].append({"role": "assistant", "content": bot_response})


    # Store bot's reply
    store_message(session_id, "bot", bot_response)

    chat_histories[session_id].append({"role": "assistant", "content": bot_response})
    return jsonify({"response": bot_response})



@app.route("/upload", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files["image"]
    
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    model_type = request.form.get("model_type", "").lower()

    if model_type not in ["fruit", "leaf"]:
        return jsonify({"error": "Invalid model type, must be 'fruit' or 'leaf'"}), 400

    try:
        img = Image.open(file.stream)
        img = img.resize((160, 160))
        imgarr = image.img_to_array(img) / 255.0
        imgarr = np.expand_dims(imgarr, axis=0)

        if model_type == "fruit":
            model = fruit_model
            class_names = fruit_class_names
        else:
            model = leaf_model
            class_names = leaf_class_names

        pred = model.predict(imgarr)

        predicted_class = class_names[np.argmax(pred)]

        disease_info = lookup_disease_info(predicted_class)

        if disease_info:
            formatted_info = {
                "Plant": disease_info.get("Plant", "N/A"),
                "Disease": disease_info.get("Disease", "N/A"),
                "Symptom": disease_info.get("Symptom", "N/A"),
                "Cause": disease_info.get("Cause", "N/A"),
                "Comment": disease_info.get("Comment", "N/A"),
                "Management": disease_info.get("Management", "N/A")
            }
        else:
            formatted_info = None

        return jsonify({
            "prediction": predicted_class,
            "diseaseInfo": formatted_info  # changed from disease_info
        })

        

        

        # return jsonify({"prediction": predicted_class})

    except Exception as e:
        return jsonify({"error": "Failed to process image"}), 500

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False, host="0.0.0.0", port=5000)

