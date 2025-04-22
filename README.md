
# 🌿 PlantDiseaseBot

**PlantDiseaseBot** is a web-based AI assistant designed to detect plant diseases from leaf images and assist farmers with offline, reliable, and fast diagnostics. Built with a responsive UI, modular architecture, and focused on accessibility, it ensures accurate results even in low-connectivity environments.

----------

## 🚀 Features

-   🖼 **Image-Based Diagnosis**: Upload plant leaf or fruit images for instant disease predictions.
    
-   💬 **LLM-Assisted Chat**: Get helpful responses with contextual follow-up using a custom small language model pipeline.
    
-   📚 **Offline Knowledge Base**: Uses a locally scraped dataset from [PlantVillage](https://plantvillage.psu.edu/plants) for fast, reliable lookups.
    
-   🧠 **Prevents LLM Hallucinations**: Combines fuzzy CSV lookup and relevant context injection to improve answer accuracy.
    
-   🔍 **Fuzzy Search**: Efficient fuzzy matching is used to handle spelling errors or similar-sounding plant names.
    
-   🔒 **Authentication & Session Management**: Uses Firebase Authentication, cookie-based session handling, and a temporary database for storing messages until logout.
    
-   📱 **Responsive UI**: Designed with a clean, mobile-friendly layout that works seamlessly across devices.
    
-   🌿 **Dual Model System**:
    
    -   **Fruit Disease Model**: Trained on ~87k images across 38 categories from 14 plant species.
        
    -   **Leaf Disease Model**: Trained on ~29k images with 28 classes from 14 plant species.
        

----------

## ⚙️ How It Works

1.  **CSV Lookup First**: When a user asks a plant-related question, the system first does a fuzzy match in a pre-loaded CSV database.
    
2.  **If Found**: That row's content is shown as output **and** given as context to the LLM to reduce hallucination.
    
3.  **For Follow-Ups**: Previous lookup data is used to maintain context across messages.
    
4.  **Temporary Context**: User messages are stored until logout, then cleared, ensuring privacy and efficiency.
    

----------

## 🌐 Tech Stack

-   **Frontend**: HTML, CSS, JavaScript
    
-   **Backend**: Python (Flask/FastAPI)
    
-   **ML Frameworks**: TensorFlow / PyTorch
    
-   **Authentication**: Firebase
    
-   **Session**: Cookies & Temporary Storage
    
-   **LLM Pipeline**: Context-aware Q&A with hallucination prevention
    
-   **Data Source**: Scraped offline dataset from [PlantVillage](https://plantvillage.psu.edu/plants)
    

----------

## 🛠 Setup Instructions

1.  **Clone the Repo**:
    
    ```bash
    git clone https://github.com/CodeInfinity007/PlantDiseaseBot.git
    cd PlantDiseaseBot
    
    ```
    
2.  **Backend Setup**:
    
    ```bash
    cd backend
    pip install -r requirements.txt
    python server.py
    
    ```
    
3.  **Frontend Setup**:
    
    ```bash
    cd ../frontend
    npm run dev
    
    ```
    

----------

## 🧩 Future Enhancements

   - 📷 **Integrate camera capture and direct upload** instead of requiring pre-clicked images.

-   ⚡ **Custom Login System**: Replace Firebase with a faster, lightweight local authentication method.
    
-   🧠 **On-Device LLM**: Integrate a local, lightweight language model to fully remove internet dependency—ideal for rural/farming communities.
    
-   🌐 **Multilingual Support**: Add native language options for improved accessibility.
    
-   📦 **Offline Updates**: Allow local CSV/database updates via USB or SD card.
    

----------

## 🌱 Why SDG 12?

PlantDiseaseBot aligns with **Sustainable Development Goal 12: Responsible Consumption and Production** by:

-   Reducing pesticide misuse through precise diagnosis.
    
-   Minimizing crop waste due to late or incorrect identification.
    
-   Supporting sustainable agriculture by empowering farmers with AI tools even in offline settings.
    



## 📬 Contact

-   **Author**: [Divyam Mathur](https://github.com/CodeInfinity007)
-  **Co-Author**: Kushal Singh
    
-   **Collaborator**: [Pranav Hariharan](https://github.com/pranavhariharan145)
    

