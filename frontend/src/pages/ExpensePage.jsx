import React, { useState } from 'react';
import STTRecorder from '../components/STTRecorder';
import axios from 'axios';
import ExpenseChart from '../components/ExpenseChart';

function ExpenseLoggerPage() {
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTranscribed = async (transcribedText) => {
    setText(transcribedText);
    if (transcribedText.trim() === "") return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/parse-text', {
        text: transcribedText,
      });
      setParsed(res.data);
      if (!res.data.error) {
        await axios.post('http://localhost:5000/api/expenses', res.data);
      }
    } catch (err) {
      console.error("Parser error:", err);
      setParsed({ error: "Parser failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">🧾 Voice-Based Expense Logger</h2>

      <STTRecorder onTranscribed={handleTranscribed} />

      {text && (
        <div>
          <h4 className="font-semibold mt-4">📝 Transcribed Text:</h4>
          <textarea
            className="w-full p-2 border rounded"
            rows="3"
            value={text}
            readOnly
          />
        </div>
      )}

      {loading && <p className="text-blue-500">⏳ Parsing...</p>}

      {parsed && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">🧠 Parsed Expense:</h3>
          {parsed.error ? (
            <p className="text-red-500">❌ {parsed.error}</p>
          ) : (
            <ul className="list-disc ml-6">
              <li><strong>Amount:</strong> ₹{parsed.amount}</li>
              <li><strong>Date:</strong> {parsed.date}</li>
              <li><strong>Category:</strong> {parsed.category}</li>
            </ul>
          )}
        </div>
      )}

      {/* 📊 Always visible expense chart */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">📊 Expense Summary</h3>
        <ExpenseChart />
      </div>
    </div>
  );
}

export default ExpenseLoggerPage;
