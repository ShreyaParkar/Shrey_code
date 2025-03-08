"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter

export default function BusesPage() {
  const router = useRouter(); // ✅ Initialize router

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", route: "", capacity: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBuses();
    fetchRoutes();
  }, []);

  async function fetchBuses() {
    try {
      const res = await fetch("/api/bus");
      const data = await res.json();
      setBuses(data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  }

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
      const res = await fetch("/api/bus", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setForm({ id: null, name: "", route: "", capacity: "" });
      setEditingId(null);
      fetchBuses();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(bus) {
    setForm({
      id: bus._id,
      name: bus.name,
      route: bus.route._id, // ✅ Ensure we set the route ID here
      capacity: bus.capacity
    });
    setEditingId(bus._id);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this bus?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/bus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error deleting bus");
      }

      fetchBuses();
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
      <h1 className="text-2xl font-bold mb-4">Manage Buses</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
        <div className="mb-2">
          <label className="block">Bus Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <div className="mb-2">
          <label className="block">Route:</label>
          <select name="route" value={form.route} onChange={handleChange} className="w-full border p-2" required>
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route._id} value={route._id}>
                {route.start} → {route.end}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Capacity:</label>
          <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className="w-full border p-2" required />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Processing..." : editingId ? "Update Bus" : "Add Bus"}
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Bus Name</th>
            <th className="border p-2">Route</th>
            <th className="border p-2">Capacity</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus._id} className="border">
              <td className="border p-2">{bus.name}</td>
              <td className="border p-2">
                {bus.route && bus.route.start ? (
                  `${bus.route.start} → ${bus.route.end}`
                ) : (
                  <span className="text-red-500">Route Not Found</span>
                )}
              </td>
              <td className="border p-2">{bus.capacity}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(bus)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(bus._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
