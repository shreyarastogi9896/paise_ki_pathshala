import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <h1>AI Financial Assistant</h1>
      <p>Choose an option to get started:</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <button onClick={() => navigate("/sms")}>Check SMS for Scam</button>
        <button onClick={() => navigate("/speak")}>Voice Input (STT)</button>
        <button onClick={() => navigate("/lesson")}>Lesson (TTS)</button>
      </div>
    </div>
  );
}
