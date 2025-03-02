"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter


export default function RoutesPage() {
    const router = useRouter(); // ✅ Initialize router

  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ id: null, start: "", end: "", fare: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoutes();
  }, []);

  async function fetchRoutes() {
    try {
      const res = await fetch("/api/route");
      const data = await res.json();
      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
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
      const res = await fetch("/api/route", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setForm({ id: null, start: "", end: "", fare: "" });
      setEditingId(null);
      fetchRoutes();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(route) {
    setForm({ id: route._id, start: route.start, end: route.end, fare: route.fare });
    setEditingId(route._id);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this route?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/route", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error deleting route");
      }

      fetchRoutes();
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
      <h1 className="text-2xl font-bold mb-4">Manage Routes</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
        <div className="mb-2">
          <label className="block">Start Location:</label>
          <input type="text" name="start" value={form.start} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="mb-2">
          <label className="block">End Location:</label>
          <input type="text" name="end" value={form.end} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="mb-2">
          <label className="block">Fare (₹):</label>
          <input type="number" name="fare" value={form.fare} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Processing..." : editingId ? "Update Route" : "Add Route"}
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Fare (₹)</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route._id} className="border">
              <td className="border p-2">{route.start}</td>
              <td className="border p-2">{route.end}</td>
              <td className="border p-2">₹{route.fare}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(route)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(route._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
