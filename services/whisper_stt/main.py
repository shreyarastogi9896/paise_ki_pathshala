from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel
import os

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model (use "small" or "medium" for Hinglish)
model = WhisperModel("medium", compute_type="int8")  # Or "medium" for better results

@app.post("/speech-to-text")
async def speech_to_text(audio: UploadFile = File(...)):
    audio_path = f"temp_{audio.filename}"

    with open(audio_path, "wb") as f:
        f.write(await audio.read())

    try:
        # You can set language="hi" for pure Hindi
        segments, info = model.transcribe(
            audio_path,
            language="hi",  # "hi" for Hindi, or try "en" for Hinglish
            beam_size=5,
            vad_filter=True,
            vad_parameters={"min_silence_duration_ms": 300}
        )

        # Combine all segments into a single string
        transcript = " ".join([seg.text for seg in segments])
        return {"text": transcript.strip()}

    except Exception as e:
        return {"error": str(e)}
    finally:
        os.remove(audio_path)
