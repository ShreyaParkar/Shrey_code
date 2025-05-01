"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function TicketPage() {
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedFare, setSelectedFare] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStationObj, setSelectedStationObj] = useState(null);
  const [loadingBusId, setLoadingBusId] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [status, setStatus] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasGeneratedTicket, setHasGeneratedTicket] = useState(false);

  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = user?.id;

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    const paymentStatus = searchParams.get("status");
    const sessionId = searchParams.get("session_id");

    if (
      paymentStatus === "success" &&
      sessionId &&
      userId &&
      !hasGeneratedTicket &&
      selectedStationObj
    ) {
      generateTicket(sessionId);
      setStatus("success");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } else if (paymentStatus === "cancel") {
      setStatus("cancel");
    }
  }, [searchParams, userId, selectedStationObj]);

  const fetchRoutes = async () => {
    const res = await fetch("/api/route");
    const data = await res.json();
    setRoutes(data);
  };

  const fetchBusesAndStations = async (routeId) => {
    if (!routeId) return;

    const busRes = await fetch(`/api/bus?routeId=${routeId}`);
    const stationRes = await fetch(`/api/stations?routeId=${routeId}`);
    const busData = await busRes.json();
    const stationData = await stationRes.json();

    setBuses(busData);
    setStations(stationData);

    const route = routes.find((r) => r._id === routeId);
    setSelectedRoute(route || null);
  };

  const handleRouteChange = (routeId) => {
    fetchBusesAndStations(routeId);
    setSelectedStation(null);
    setSelectedFare(null);
    setSelectedStationObj(null);
  };

  const handleStationSelect = (station) => {
    setSelectedStation(station._id);
    setSelectedFare(station.fare);
    setSelectedStationObj(station);
  };

  const handlePayment = async (busId) => {
    if (!selectedStationObj) {
      alert("Please select a station.");
      return;
    }

    setLoadingBusId(busId);

    const res = await fetch("/api/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bus: busId, station: selectedStationObj }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Payment failed.");
    }

    setLoadingBusId(null);
  };

  const generateTicket = async (sessionId) => {
    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userId,
          stationId: selectedStationObj._id,
          busId: selectedStationObj.busId._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTicketData(data.ticket);
        setHasGeneratedTicket(true);
      } else {
        throw new Error(data.error || "Failed to generate ticket.");
      }
    } catch (err) {
      console.error("Ticket generation failed:", err.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">🎟️ Book a Ticket</h1>

      {showSuccess && (
        <div className="p-4 mb-4 bg-green-100 text-green-800 rounded shadow">
          ✅ Ticket booked successfully!
        </div>
      )}
      {status === "cancel" && (
        <div className="p-4 mb-4 bg-red-100 text-red-800 rounded shadow">
          ❌ Payment canceled. Please try again.
        </div>
      )}

      {ticketData && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-900 rounded shadow">
          <p><strong>🎫 Ticket ID:</strong> {ticketData._id}</p>
          <p><strong>📍 From:</strong> {ticketData.startStation}</p>
          <p><strong>📍 To:</strong> {ticketData.endStation}</p>
          <p><strong>🚌 Bus:</strong> {ticketData.busId}</p>
          <p><strong>💰 Fare:</strong> ₹{ticketData.price}</p>
          <p><strong>⏳ Expires:</strong> {new Date(ticketData.expiryDate).toLocaleString()}</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block font-medium mb-2">Select Route:</label>
        <select
          onChange={(e) => handleRouteChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">-- Choose a route --</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.start} → {route.end}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border shadow-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">Bus</th>
              <th className="p-3">Stations</th>
              <th className="p-3">Fare</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => {
              const busStations = stations.filter(
                (st) => String(st.busId?._id) === String(bus._id)
              );
              return (
                <tr key={bus._id}>
                  <td className="border p-2">{bus.name}</td>
                  <td className="border p-2">
                    {busStations.map((station) => (
                      <div
                        key={station._id}
                        onClick={() => handleStationSelect(station)}
                        className={`cursor-pointer mb-1 px-2 py-1 rounded ${
                          selectedStation === station._id
                            ? "bg-green-300"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {station.name} - ₹{station.fare}
                      </div>
                    ))}
                  </td>
                  <td className="border p-2">
                    {selectedStation &&
                    busStations.some((st) => st._id === selectedStation)
                      ? `₹${selectedFare}`
                      : "Select a station"}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handlePayment(bus._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      disabled={!selectedStation || loadingBusId === bus._id}
                    >
                      {loadingBusId === bus._id ? "Processing..." : "Book"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
