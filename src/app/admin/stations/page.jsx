"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminStations() {
  const router = useRouter();

  // State Variables
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedBus, setSelectedBus] = useState("");
  const [form, setForm] = useState({ name: "", latitude: "", longitude: "", fare: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Routes on Load
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

  async function fetchBuses(routeId) {
    try {
      const res = await fetch(`/api/bus?routeId=${routeId}`);
      const data = await res.json();
      setBuses(data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  }

  async function fetchStations(routeId, busId) {
    try {
      const res = await fetch(`/api/stations?routeId=${routeId}&busId=${busId}`);
      const data = await res.json();
      setStations(data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  }

  function handleRouteChange(e) {
    const routeId = e.target.value;
    setSelectedRoute(routeId);
    setSelectedBus(""); // Reset bus when changing route
    setStations([]);
    fetchBuses(routeId);
  }

  function handleBusChange(e) {
    const busId = e.target.value;
    setSelectedBus(busId);
    fetchStations(selectedRoute, busId);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = editingId
      ? { id: editingId, routeId: selectedRoute, busId: selectedBus, ...form }
      : { routeId: selectedRoute, busId: selectedBus, ...form };

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch("/api/stations", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Something went wrong");

      setForm({ name: "", latitude: "", longitude: "", fare: "" });
      setEditingId(null);
      fetchStations(selectedRoute, selectedBus);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(station) {
    setForm({
      name: station.name,
      latitude: station.latitude,
      longitude: station.longitude,
      fare: station.fare,
    });
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

      if (!res.ok) throw new Error("Error deleting station");

      fetchStations(selectedRoute, selectedBus);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <button onClick={() => router.push("/admin")} className="mb-4 bg-gray-600 text-white px-4 py-2 rounded">
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Manage Stations</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Route Selection */}
      <select onChange={handleRouteChange} className="w-full border p-2 mb-2">
        <option value="">Select Route</option>
        {routes.map((route) => (
          <option key={route._id} value={route._id}>{route.start} → {route.end}</option>
        ))}
      </select>

      {/* Bus Selection (Filtered by Route) */}
      <select onChange={handleBusChange} className="w-full border p-2 mb-4" disabled={!selectedRoute}>
        <option value="">Select Bus</option>
        {buses.length > 0 ? (
          buses.map((bus) => (
            <option key={bus._id} value={bus._id}>{bus.name}</option>
          ))
        ) : (
          <option value="">No Buses Found</option>
        )}
      </select>

      {/* Station Form */}
      {selectedBus && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
          <div className="mb-2">
            <label className="block">Station Name:</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border p-2" required />
          </div>
          <div className="mb-2">
            <label className="block">Latitude:</label>
            <input type="number" name="latitude" value={form.latitude} onChange={handleChange} className="w-full border p-2" required />
          </div>
          <div className="mb-2">
            <label className="block">Longitude:</label>
            <input type="number" name="longitude" value={form.longitude} onChange={handleChange} className="w-full border p-2" required />
          </div>
          <div className="mb-2">
            <label className="block">Fare (₹):</label>
            <input type="number" name="fare" value={form.fare} onChange={handleChange} className="w-full border p-2" required />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? "Processing..." : editingId ? "Update Station" : "Add Station"}
          </button>
        </form>
      )}

      {/* Station Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Latitude</th>
            <th className="border p-2">Longitude</th>
            <th className="border p-2">Fare</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stations.length > 0 ? (
            stations.map((station) => (
              <tr key={station._id} className="border">
                <td className="border p-2">{station.name}</td>
                <td className="border p-2">{station.latitude}</td>
                <td className="border p-2">{station.longitude}</td>
                <td className="border p-2">₹{station.fare}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(station)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(station._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="text-center p-4">No stations available</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
