"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username1.trim()) {
      router.push(`/profile/${username1}`);
    }
  };

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (username1.trim() && username2.trim()) {
      router.push(`/compare?user1=${username1}&user2=${username2}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md transform transition-all hover:shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-100">
          GitHub Profile Explorer
        </h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            value={username1}
            onChange={(e) => setUsername1(e.target.value)}
            placeholder="Enter GitHub username"
            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          />
          <button
            type="submit"
            className="w-full p-3 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
        <form onSubmit={handleCompare} className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-300">
            Compare Two Users
          </h2>
          <input
            type="text"
            value={username1}
            onChange={(e) => setUsername1(e.target.value)}
            placeholder="First GitHub username"
            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          />
          <input
            type="text"
            value={username2}
            onChange={(e) => setUsername2(e.target.value)}
            placeholder="Second GitHub username"
            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
          >
            Compare
          </button>
        </form>
      </div>
    </div>
  );
}
