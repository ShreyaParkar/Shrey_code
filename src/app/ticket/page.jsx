"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TicketPage() {
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedFare, setSelectedFare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchRoutes();
  }, []);

  // ✅ Fetch Routes
  async function fetchRoutes() {
    try {
      const res = await fetch("/api/route");
      const data = await res.json();
      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  }

  // ✅ Fetch Buses & Stations for a specific route
  async function fetchBusesAndStations(routeId) {
    try {
      if (!routeId) return;

      // Fetch Buses for the Route
      const busRes = await fetch(`/api/bus?routeId=${routeId}`);
      const busData = await busRes.json();
      setBuses(busData);

      // Fetch Stations for Route & Bus
      const stationRes = await fetch(`/api/stations?routeId=${routeId}`);
      const stationData = await stationRes.json();
      setStations(stationData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // ✅ Handle Selecting a Route (Fetch relevant Buses & Stations)
  const handleRouteChange = (routeId) => {
    fetchBusesAndStations(routeId);
    setSelectedStation(null);
    setSelectedFare(null);
  };

  // ✅ Handle Selecting Station
  const handleStationSelect = (station) => {
    setSelectedStation(station._id);
    setSelectedFare(station.fare);
  };

  // ✅ Handle Checkout Payment
  const handlePayment = async (busId) => {
    if (!selectedStation) {
      alert("Please select a station before proceeding.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bus: busId, station: selectedStation }),
      });

      const { url, error } = await res.json();
      if (url) {
        window.location.href = url; // ✅ Redirect to Stripe Checkout
      } else {
        alert(error || "Payment failed");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        🎟️ Available Routes & Stations
      </h1>

      {/* ✅ Payment Status Messages */}
      {status === "success" && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
          ✅ Payment Successful! Your ticket is booked.
        </div>
      )}
      {status === "cancel" && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
          ❌ Payment Canceled. Please try again.
        </div>
      )}

      {/* ✅ Route Selection */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Select a Route:</label>
        <select
          onChange={(e) => handleRouteChange(e.target.value)}
          className="border p-2 w-full rounded bg-white shadow"
        >
          <option value="">-- Choose a Route --</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.start} → {route.end}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Table of Routes, Buses & Stations */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border p-3 text-left">Route</th>
              <th className="border p-3 text-left">Bus</th>
              <th className="border p-3 text-left">Stations</th>
              <th className="border p-3 text-left">Fare</th>
              <th className="border p-3 text-center">Book</th>
            </tr>
          </thead>
          <tbody>
            {buses.length > 0 ? (
              buses.map((bus) => {
                const busStations = stations.filter((station) => String(station.busId?._id) === String(bus._id));

                return (
                  <tr key={bus._id} className="border-b">
                    {/* ✅ Route Column (only for first bus under each route) */}
                    <td className="border p-3 font-semibold">
                      {bus.route?.start} → {bus.route?.end}
                    </td>

                    {/* ✅ Bus Column */}
                    <td className="border p-3 font-semibold">{bus.name}</td>

                    {/* ✅ Stations Column */}
                    <td className="border p-3">
                      {busStations.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {busStations.map((station) => (
                            <li
                              key={station._id}
                              className={`p-2 rounded cursor-pointer flex justify-between ${
                                selectedStation === station._id ? "bg-green-300" : "hover:bg-gray-200"
                              }`}
                              onClick={() => handleStationSelect(station)}
                            >
                              <span>{station.name}</span>
                              <span className="font-semibold">₹{station.fare}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">No Stations Available</span>
                      )}
                    </td>

                    {/* ✅ Fare Column (Updates dynamically based on selected station) */}
                    <td className="border p-3 font-semibold">
                      {selectedStation && busStations.some((st) => st._id === selectedStation)
                        ? `₹${selectedFare}`
                        : "Select a station"}
                    </td>

                    {/* ✅ Book Column */}
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => handlePayment(bus._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        disabled={!selectedStation || loading}
                      >
                        {loading ? "Processing..." : "Book"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">No buses or stations available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
