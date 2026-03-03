# Aadhar e-KYC OCR Extractor 🇮🇳

A full-stack web application designed to securely extract structured e-KYC data (Name, Aadhar Number, Date of Birth, Gender, and Address) from Aadhar card images. 

Unlike traditional OCR engines (like Tesseract) which struggle with holograms, varied lighting, and complex document layouts, this project leverages **Google's Gemini 2.5 Flash** vision model to perform highly accurate, hallucination-resistant document analysis and return strictly formatted JSON data.

## 🚀 Features
* **Drag-and-Drop/Upload Interface:** Simple React frontend for uploading Aadhar images.
* **Image Preview:** View the document before processing.
* **AI-Powered Extraction:** Uses Generative AI to cleanly parse and structure complex PII.
* **REST API:** Lightweight, blazing-fast FastAPI backend.
* **CORS Enabled:** Ready to be connected to any frontend application.

## 🛠️ Tech Stack
* **Frontend:** React.js, HTML/CSS
* **Backend:** Python, FastAPI, Uvicorn
* **AI Model:** Google Gemini 2.5 Flash (`google-generativeai`)

## ⚙️ Prerequisites
Before running this project, ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v14 or higher)
* [Python](https://www.python.org/) (3.8 or higher)
* A valid [Google Gemini API Key](https://aistudio.google.com/app/apikey)

## 💻 Local Setup Instructions

### 1. Start the Backend (FastAPI)
Navigate to the backend directory, set up your Python environment, and start the server:

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set your API Key
# On Windows: set GEMINI_API_KEY="your_api_key_here"
# On Mac/Linux: export GEMINI_API_KEY="your_api_key_here"

# Run the server
uvicorn main:app --reload
