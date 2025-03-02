"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function TicketPage() {
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchRoutes();
    fetchStations(); // ✅ Fetch all stations on page load

    if (searchParams.get("status") === "success") {
      setStatus("success");
    } else if (searchParams.get("status") === "cancel") {
      setStatus("cancel");
    }
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

  async function fetchStations() {
    try {
      const res = await fetch("/api/stations");
      const data = await res.json();
      setStations(data);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  }

  // ✅ Handle Checkout Payment
  const handlePayment = async () => {
    if (!selectedRoute || !selectedStation) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route: selectedRoute, station: selectedStation }),
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
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        🎟️ Book Your Ticket
      </h1>

      {/* Payment Status Messages */}
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

      {/* Route Selection */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Route:</label>
        <select
          onChange={(e) => setSelectedRoute(JSON.parse(e.target.value))}
          className="border p-2 w-full rounded bg-white shadow"
        >
          <option value="">-- Choose a Route --</option>
          {routes.map((route) => (
            <option key={route._id} value={JSON.stringify(route)}>
              {route.start} → {route.end} | ₹{route.fare}
            </option>
          ))}
        </select>
      </div>

      {/* Station Selection (All Stations) */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Station:</label>
        {stations.length > 0 ? (
          <select
            onChange={(e) => setSelectedStation(e.target.value)}
            className="border p-2 w-full rounded bg-white shadow"
          >
            <option value="">-- Choose a Station --</option>
            {stations.map((station) => (
              <option key={station._id} value={station.name}>
                {station.name} (Route: {station.route})
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-500">🔄 No stations available.</p>
        )}
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        className="mt-4 bg-blue-500 text-white p-3 rounded w-full text-lg font-semibold hover:bg-blue-600 transition"
        disabled={!selectedRoute || !selectedStation || loading}
      >
        {loading ? "Processing..." : `Proceed to Payment 💳`}
      </button>
    </div>
  );
}
