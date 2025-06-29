
import React, { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import axios from "axios";

export default function STTRecorder({ onTranscribed })  {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (blobUrl) => {
    setLoading(true);
    try {
      const blob = await fetch(blobUrl).then((res) => res.blob());
      const file = new File([blob], "audio.wav", { type: "audio/wav" });

      const formData = new FormData();
      formData.append("audio", file);

      const response = await axios.post("http://localhost:5000/api/stt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const text = response.data.text || "No response";
      setTranscript(text);
      if (onTranscribed) onTranscribed(text); 

    } catch (err) {
      console.error("Transcription error:", err);
      setTranscript("❌ STT failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">🎙️ Speak Something</h2>

      <ReactMediaRecorder
        audio
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div className="space-y-4">
            <p>Status: {status}</p>
            <button onClick={startRecording} className="p-2 bg-green-400 rounded">Start</button>
            <button
              onClick={() => {
                stopRecording();
                setTimeout(() => {
                  if (mediaBlobUrl) handleUpload(mediaBlobUrl);
                }, 500);
              }}
              className="p-2 bg-red-400 rounded"
            >
              Stop & Transcribe
            </button>

            {mediaBlobUrl && (
              <div>
                <p>🎧 Recorded Audio:</p>
                <audio src={mediaBlobUrl} controls />
              </div>
            )}

            {loading && <p>⏳ Transcribing...</p>}

            {transcript && (
              <div className="p-2 bg-gray-100 rounded">
                <strong>📝 Transcribed Text:</strong>
                <p>{transcript}</p>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}
