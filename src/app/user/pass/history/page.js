"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // ✅ Fetch logged-in user

export default function PassHistory() {
  const { user } = useUser(); // ✅ Get logged-in user
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) fetchPassHistory(user.id);
  }, [user]);

  async function fetchPassHistory(userId) {
    try {
      const res = await fetch(`/api/pass-usage?userId=${userId}`);
      const data = await res.json();

      if (res.ok) {
        setHistory(data);
      } else {
        setError(data.error || "Error fetching pass history");
      }
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">📜 Pass Usage History</h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">Loading...</p>}

      {history.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border p-3 text-left">Route</th>
              <th className="border p-3 text-left">Fare</th>
              <th className="border p-3 text-left">Scanned At</th>
              <th className="border p-3 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry._id} className="border-b">
                <td className="border p-3">{entry.passId?.route || "N/A"}</td>
                <td className="border p-3">₹{entry.passId?.fare || "N/A"}</td>
                <td className="border p-3">{new Date(entry.scannedAt).toLocaleString()}</td>
                <td className="border p-3">{entry.location || "Unknown"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No pass usage history found.</p>
      )}
    </div>
  );
}
