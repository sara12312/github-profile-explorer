// app/components/SummarizeButton.tsx
"use client";

import { useState } from "react";
import { User, Repo } from "@/app/types/github";

interface SummarizeButtonProps {
  user: User;
  repos: Repo[];
}

export default function SummarizeButton({ user, repos }: SummarizeButtonProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, repos }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
      }
    } catch {
      setError("An error occurred while summarizing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <button
        onClick={handleSummarize}
        disabled={loading}
        className="bg-green-800 text-gray-100 p-2 rounded-md hover:bg-green-900 disabled:bg-green-600 cursor-pointer"
      >
        {loading ? "Summarizing..." : "Summarize Profile"}
      </button>
      {summary && (
        <div className="mt-4 bg-gray-600 shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Profile Summary</h2>
          <p className="text-gray-100">{summary}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
