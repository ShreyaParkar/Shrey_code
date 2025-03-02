"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter

export default function Admin() {
  const router = useRouter(); // ✅ Initialize router

  const [stations, setStations] = useState([]);
  const [form, setForm] = useState({ routeId: "", name: "", latitude: "", longitude: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStations();
  }, []);

  async function fetchStations() {
    try {
      const res = await fetch("/api/stations");
      const data = await res.json();
      setStations(data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const method = editingId ? "PUT" : "POST";
    const payload = editingId ? { id: editingId, ...form } : form;

    try {
      const res = await fetch("/api/stations", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setForm({ routeId: "", name: "", latitude: "", longitude: "" });
      setEditingId(null);
      fetchStations();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(station) {
    setForm({ routeId: station.routeId, name: station.name, latitude: station.latitude, longitude: station.longitude });
    setEditingId(station._id);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this station?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/stations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error deleting station");
      }

      fetchStations();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* ✅ Back Button */}
      <button onClick={() => router.push("/admin")} className="mb-4 bg-gray-600 text-white px-4 py-2 rounded">
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Manage Stations</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
        <div className="mb-2">
          <label className="block">Route ID:</label>
          <input
            type="text"
            name="routeId"
            value={form.routeId}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block">Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block">Latitude:</label>
          <input
            type="number"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block">Longitude:</label>
          <input
            type="number"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Processing..." : editingId ? "Update Station" : "Add Station"}
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Latitude</th>
            <th className="border p-2">Longitude</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <tr key={station._id} className="border">
              <td className="border p-2">{station.name}</td>
              <td className="border p-2">{station.latitude}</td>
              <td className="border p-2">{station.longitude}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(station)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(station._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
