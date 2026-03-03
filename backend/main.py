import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pydantic import BaseModel
import typing_extensions

# Configure your API Key (Set this in your environment variables)
# os.environ["GEMINI_API_KEY"] = "your_api_key_here"
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

app = FastAPI(title="Aadhar e-KYC Extraction API")

# Allow React frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AadharData(BaseModel):
    name: str
    aadhar_number: str
    dob: str
    gender: str
    address: str

@app.post("/api/v1/extract-kyc")
async def extract_kyc(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    try:
        # Read file bytes
        contents = await file.read()
        
        # Prepare the image for the model
        image_parts = [
            {
                "mime_type": file.content_type,
                "data": contents
            }
        ]
        
        # Initialize the vision model (Flash is ideal for quick document analysis)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = """
        Analyze this Aadhar card image. Extract the following details and return them strictly adhering to the JSON schema.
        If a field is not visible, return "Not Found". Clean up the Aadhar number to be a single 12-digit string without spaces.
        """
        
        # Generate the structured response
        response = model.generate_content(
            [prompt, image_parts[0]],
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=AadharData,
                temperature=0.1 # Low temperature for factual extraction
            )
        )
        
        return {
            "status": "success",
            "filename": file.filename,
            "data": response.text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))