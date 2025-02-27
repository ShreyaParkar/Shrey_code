"use client";
import { useState, useEffect } from "react";

const AdminPage = () => {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routeData, setRouteData] = useState({ start: "", end: "", fare: "" });
  const [busData, setBusData] = useState({ name: "", route: "", capacity: "" });

  useEffect(() => {
    fetchRoutes();
    fetchBuses();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await fetch("/api/route");
      const data = await res.json();
      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchBuses = async () => {
    try {
      const res = await fetch("/api/bus");
      const data = await res.json();
      setBuses(data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  const addRoute = async () => {
    if (!routeData.start || !routeData.end || routeData.fare === "") {
      alert("All fields (Start, End, Fare) are required!");
      return;
    }

    try {
      const res = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routeData),
      });

      if (!res.ok) {
        throw new Error("Failed to add route");
      }

      const newRoute = await res.json();
      setRoutes([...routes, newRoute]);
      setRouteData({ start: "", end: "", fare: "" });
    } catch (error) {
      console.error("Error adding route:", error.message);
    }
  };

  const deleteRoute = async (id) => {
    try {
      await fetch(`/api/route/${id}`, { method: "DELETE" });
      setRoutes(routes.filter((route) => route._id !== id));
    } catch (error) {
      console.error("Error deleting route:", error.message);
    }
  };

  const addBus = async () => {
    if (!busData.name || !busData.route || !busData.capacity) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch("/api/bus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(busData),
      });

      if (!res.ok) {
        throw new Error("Failed to add bus");
      }

      const newBus = await res.json();
      setBuses([...buses, newBus]);
      setBusData({ name: "", route: "", capacity: "" });
    } catch (error) {
      console.error("Error adding bus:", error.message);
    }
  };

  const deleteBus = async (id) => {
    try {
      await fetch(`/api/bus/${id}`, { method: "DELETE" });
      setBuses(buses.filter((bus) => bus._id !== id));
    } catch (error) {
      console.error("Error deleting bus:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      {/* Route Form */}
      <div className="border p-4 rounded bg-gray-100 mb-6">
        <h2 className="text-lg font-semibold">Add New Route</h2>
        <input
          type="text"
          value={routeData.start}
          onChange={(e) => setRouteData({ ...routeData, start: e.target.value })}
          placeholder="Start Location"
          className="border p-2 w-full mt-2"
        />
        <input
          type="text"
          value={routeData.end}
          onChange={(e) => setRouteData({ ...routeData, end: e.target.value })}
          placeholder="End Location"
          className="border p-2 w-full mt-2"
        />
        <input
          type="number"
          value={routeData.fare}
          onChange={(e) => setRouteData({ ...routeData, fare: e.target.value })}
          placeholder="Fare (₹)"
          className="border p-2 w-full mt-2"
        />
        <button onClick={addRoute} className="mt-3 bg-green-500 text-white p-2 rounded w-full">
          Add Route
        </button>
      </div>

      {/* Routes List */}
      <div className="border p-4 rounded bg-gray-200 mb-6">
        <h2 className="text-lg font-semibold">Available Routes</h2>
        {routes.length > 0 ? (
          <ul className="mt-2">
            {routes.map((route) => (
              <li key={route._id} className="p-2 border-b flex justify-between items-center">
                {route.start} → {route.end} (₹{route.fare})
                <button onClick={() => deleteRoute(route._id)} className="ml-2 bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No routes added yet.</p>
        )}
      </div>

      {/* Bus Form */}
      <div className="border p-4 rounded bg-gray-100">
        <h2 className="text-lg font-semibold">Add New Bus</h2>
        <input
          type="text"
          value={busData.name}
          onChange={(e) => setBusData({ ...busData, name: e.target.value })}
          placeholder="Bus Name"
          className="border p-2 w-full mt-2"
        />
        <select
          value={busData.route}
          onChange={(e) => setBusData({ ...busData, route: e.target.value })}
          className="border p-2 w-full mt-2"
        >
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.start} → {route.end}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={busData.capacity}
          onChange={(e) => setBusData({ ...busData, capacity: Number(e.target.value) })}
          placeholder="Capacity"
          className="border p-2 w-full mt-2"
        />
        <button onClick={addBus} className="mt-3 bg-blue-500 text-white p-2 rounded w-full">
          Add Bus
        </button>
      </div>

      {/* Bus List */}
      <div className="border p-4 rounded bg-gray-200 mt-6">
        <h2 className="text-lg font-semibold">Available Buses</h2>
        {buses.length > 0 ? (
          <ul className="mt-2">
            {buses.map((bus) => {
              const route = routes.find((r) => r._id === bus.route);
              return (
                <li key={bus._id} className="p-2 border-b flex justify-between items-center">
                  {bus.name} - {route ? `${route.start} → ${route.end}` : "Unknown Route"} (Capacity: {bus.capacity})
                  <button onClick={() => deleteBus(bus._id)} className="ml-2 bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No buses added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
