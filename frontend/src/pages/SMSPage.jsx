import React, { useState } from "react";
import axios from "axios";

export default function SMSPage() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/sms-check", {
        message: message,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error checking SMS:", error);
      setResult({ scam: false, confidence: 0, error: "Something went wrong" });
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h2>🔍 Scam SMS Detector</h2>
      <form onSubmit={handleCheck}>
        <textarea
          rows="4"
          cols="50"
          placeholder="Paste your SMS here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Check SMS"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Result: {result.scam ? "🚨 Scam Detected" : "✅ Safe"}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
          {result.error && <p style={{ color: "red" }}>{result.error}</p>}
        </div>
      )}
    </div>
  );
}
