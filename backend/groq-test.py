from groq import Groq

# Initialize Groq API client
client = Groq(api_key="REDACTED")


def chat_with_groq():
    print("\nPlant Disease Chatbot (Type 'exit' to quit)\n")
    conversation_history = [
        {"role": "system", "content": "You are a plant disease expert. Your task is to provide detailed advice on plant diseases, symptoms, causes, and treatments. Always give clear and helpful answers without unnecessary disclaimers."}
    ]
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Goodbye!")
            break
        
        # Add user message to conversation history
        conversation_history.append({"role": "user", "content": user_input})
        
        # Call Groq API
        response = client.chat.completions.create(
            model="gemma2-9b-it",
            messages=conversation_history,
            temperature=0.7,  # Adjust for randomness
            max_tokens=256,  # Limit response length
            top_p=1.0,  # Controls response diversity
            stream=False  # Set to True for streaming responses
        )
        
        # Extract chatbot response
        bot_response = response.choices[0].message.content
        print("Chatbot:", bot_response, "\n")
        
        # Add bot response to conversation history
        conversation_history.append({"role": "assistant", "content": bot_response})

if __name__ == "__main__":
    chat_with_groq()