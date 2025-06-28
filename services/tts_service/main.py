from fastapi import FastAPI, Form, BackgroundTasks
from fastapi.responses import FileResponse
from gtts import gTTS
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/tts")
async def tts(background_tasks: BackgroundTasks, text: str = Form(...)):
    filename = f"tts_{uuid.uuid4().hex}.mp3"
    tts = gTTS(text=text, lang='hi')
    tts.save(filename)

    # Schedule deletion after response
    background_tasks.add_task(os.remove, filename)

    return FileResponse(
        filename,
        media_type="audio/mpeg",
        filename="speech.mp3",
        background=background_tasks
    )