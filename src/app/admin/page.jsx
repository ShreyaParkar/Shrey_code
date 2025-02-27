"use client";

import { useState, useEffect } from "react";

const AdminPage = () => {
  // Route States
  const [routes, setRoutes] = useState([]);
  const [routeData, setRouteData] = useState({ id: null, start: "", end: "", fare: "" });
  const [editingRoute, setEditingRoute] = useState(false);

  // Bus States
  const [buses, setBuses] = useState([]);
  const [busData, setBusData] = useState({ id: null, name: "", route: "", capacity: "" });
  const [editingBus, setEditingBus] = useState(false);

  useEffect(() => {
    fetchRoutes();
    fetchBuses();
  }, []);

  // Fetch Routes
  const fetchRoutes = async () => {
    try {
      const res = await fetch("/api/route");
      const data = await res.json();
      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  // Fetch Buses
  const fetchBuses = async () => {
    try {
      const res = await fetch("/api/bus");
      const data = await res.json();
      setBuses(data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  // Add or Update Route
  const addOrUpdateRoute = async () => {
    if (!routeData.start || !routeData.end || routeData.fare === "") {
      alert("All fields (Start, End, Fare) are required!");
      return;
    }

    const url = "/api/route";
    const method = routeData.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routeData),
      });

      fetchRoutes();
      setRouteData({ id: null, start: "", end: "", fare: "" });
      setEditingRoute(false);
    } catch (error) {
      console.error("Error saving route:", error);
    }
  };

  // Delete Route
  const deleteRoute = async (id) => {
    try {
      await fetch("/api/route", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      setRoutes(routes.filter((route) => route._id !== id));
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  // Add or Update Bus
  const addOrUpdateBus = async () => {
    if (!busData.name || !busData.route || !busData.capacity) {
      alert("All fields (Name, Route, Capacity) are required!");
      return;
    }

    const url = "/api/bus";
    const method = busData.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(busData),
      });

      fetchBuses();
      setBusData({ id: null, name: "", route: "", capacity: "" });
      setEditingBus(false);
    } catch (error) {
      console.error("Error saving bus:", error);
    }
  };

  // Delete Bus
  const deleteBus = async (id) => {
    try {
      await fetch("/api/bus", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      setBuses(buses.filter((bus) => bus._id !== id));
    } catch (error) {
      console.error("Error deleting bus:", error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      {/* Route Form */}
      <div className="border p-4 rounded bg-gray-100 mb-6">
        <h2 className="text-lg font-semibold">{editingRoute ? "Edit Route" : "Add New Route"}</h2>
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
        <button onClick={addOrUpdateRoute} className="mt-3 bg-green-500 text-white p-2 rounded w-full">
          {editingRoute ? "Update Route" : "Add Route"}
        </button>
      </div>

      {/* Route List */}
      <div className="border p-4 rounded bg-gray-200 mb-6">
        <h2 className="text-lg font-semibold">Available Routes</h2>
        {routes.length > 0 ? (
          <ul className="mt-2">
            {routes.map((route) => (
              <li key={route._id} className="p-2 border-b flex justify-between items-center">
                {route.start} → {route.end} (₹{route.fare})
                <div>
                  <button onClick={() => setRouteData({ ...route, id: route._id }) & setEditingRoute(true)} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => deleteRoute(route._id)} className="ml-2 bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No routes added yet.</p>
        )}
      </div>

      {/* Bus Form */}
      <div className="border p-4 rounded bg-gray-100 mb-6">
        <h2 className="text-lg font-semibold">{editingBus ? "Edit Bus" : "Add New Bus"}</h2>
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
          onChange={(e) => setBusData({ ...busData, capacity: e.target.value })}
          placeholder="Capacity"
          className="border p-2 w-full mt-2"
        />
        <button onClick={addOrUpdateBus} className="mt-3 bg-green-500 text-white p-2 rounded w-full">
          {editingBus ? "Update Bus" : "Add Bus"}
        </button>
      </div>

      {/* Bus List */}
<div className="border p-4 rounded bg-gray-200">
  <h2 className="text-lg font-semibold">Available Buses</h2>
  {buses.length > 0 ? (
    <ul className="mt-2">
      {buses.map((bus) => {
        // Find the route details based on bus.route ID
        const busRoute = routes.find(route => route._id === bus.route);
        return (
          <li key={bus._id} className="p-2 border-b flex justify-between items-center">
            <div>
              <span className="font-semibold">{bus.name}</span> - {bus.capacity} seats
              <br />
              <span className="text-sm text-gray-600">
                Route: {busRoute ? `${busRoute.start} → ${busRoute.end}` : "Not Found"}
              </span>
            </div>
            <div>
              {/* Edit Button */}
              <button 
                onClick={() => {
                  setBusData({ id: bus._id, name: bus.name, route: bus.route, capacity: bus.capacity });
                  setEditingBus(true);
                }} 
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              {/* Delete Button */}
              <button 
                onClick={() => deleteBus(bus._id)} 
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
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
