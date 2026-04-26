# routes/voice_routes.py
from fastapi import APIRouter, UploadFile, File
from services.audio_service import extract_hesitation_metrics

# Initialize the router instead of the full FastAPI app
router = APIRouter()

@router.post("/analyze-voice")
async def analyze_voice(file: UploadFile = File(...)):
    try:
        # 1. Zero-Trust Data Protocol: Read directly into RAM
        audio_bytes = await file.read()
        
        # 2. Pass the raw bytes to the isolated Machine Learning service
        analysis_result = extract_hesitation_metrics(audio_bytes)
        
        # 3. Drop the audio from memory and return the secure payload
        return {
            "hesitation_index": analysis_result["hesitation_index"],
            "metrics": analysis_result["metrics"],
            "status": "success",
            "message": "Audio processed securely via isolated service."
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}