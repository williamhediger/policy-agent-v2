"use client";
import { useState } from "react";

export default function PolicyAssistant() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    const res = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ question: query }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        placeholder="Ask a policy question..."
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleAsk}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
      {answer && (
        <div className="mt-4 p-4 bg-gray-50 border rounded">
          <p className="font-semibold">Answer:</p>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
