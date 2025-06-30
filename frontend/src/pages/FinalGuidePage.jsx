import React, { useState } from "react";
import axios from "axios";

function FinalInvestmentGuide() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post("http://localhost:8008/investment-guide", {
        user_input: userInput,
      });
      setResult(res.data);
    } catch (error) {
      console.error("API Error:", error);
      setResult({ error: "Failed to fetch guide." });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">💰 Smart Investment Guide</h2>
      
      <textarea
        className="w-full border p-2 rounded mb-4"
        placeholder="Describe your financial need (in Hindi or English)..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        rows={4}
      />
      
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Get Guide"}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-2">🎯 Extracted Details</h3>
              <p><strong>Purpose:</strong> {result.purpose}</p>
              <p><strong>Time Horizon:</strong> {result.time_horizon}</p>

              <h3 className="mt-4 font-semibold">⚖️ Product Weights</h3>
              <ul className="list-disc ml-6">
                {Object.entries(result.adjusted_weights).map(([key, val]) => (
                  <li key={key}>{key}: {(val * 100).toFixed(1)}%</li>
                ))}
              </ul>

              <h3 className="mt-4 font-semibold">📉 Market Sentiments</h3>
              <ul className="list-disc ml-6">
                {Object.entries(result.sentiments || {}).map(([key, val]) => (
                  <li key={key}>{key}: {val}</li>
                ))}
              </ul>

              {result.mutual_fund_suggestions && result.mutual_fund_suggestions.length > 0 && (
                <>
                  <h3 className="mt-4 font-semibold">🏆 Recommended Mutual Funds</h3>
                  <ol className="list-decimal ml-6">
                    {result.mutual_fund_suggestions.map((fund, i) => (
                      <li key={i}>
                        <strong>{fund.scheme_name}</strong> – Predicted Return: {fund.predicted_5yr.toFixed(2)}%
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default FinalInvestmentGuide;
