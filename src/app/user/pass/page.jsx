"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // ✅ Fetch user details from Clerk
import { QRCodeCanvas } from "qrcode.react"; // ✅ QR Code generator

export default function PassPage() {
  const { user } = useUser(); // ✅ Get logged-in user
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [passQR, setPassQR] = useState("");
  const [hasPass, setHasPass] = useState(false);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch routes on page load
  useEffect(() => {
    fetchRoutes();
    checkUserPass();
  }, [user]);

  async function fetchRoutes() {
    try {
      const res = await fetch("/api/route");
      const data = await res.json();
      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  }

  async function checkUserPass() {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/pass?userId=${user.id}`);
      const data = await res.json();

      if (data.expired) {
        setExpired(true);
        setHasPass(false);
      } else if (data.routeId) {
        setPassQR(JSON.stringify(data));
        setHasPass(true);
      }
    } catch (error) {
      console.error("Error fetching pass:", error);
    }
  }

  async function buyPass() {
    if (!selectedRoute || !user?.id) {
      alert("Please select a route.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, routeId: selectedRoute._id, fare: selectedRoute.fare }),
      });

      const newPass = await res.json();
      setPassQR(JSON.stringify(newPass));
      setHasPass(true);
    } catch (error) {
      console.error("Error buying pass:", error);
    }
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        🎫 Monthly Travel Pass
      </h1>

      {/* Show QR if pass exists */}
      {hasPass && !expired ? (
        <div className="flex flex-col items-center bg-gray-100 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Your Pass QR Code</h2>
          <QRCodeCanvas value={passQR} size={200} />
          <p className="mt-2 text-sm text-gray-600">Valid until: {new Date(JSON.parse(passQR).expiryDate).toDateString()}</p>
        </div>
      ) : (
        <>
          {/* Route Selection */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Select Route:</label>
            <select
              onChange={(e) => setSelectedRoute(routes.find((r) => r._id === e.target.value))}
              className="border p-2 w-full rounded bg-white shadow"
            >
              <option value="">-- Choose a Route --</option>
              {routes.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.start} → {route.end} | ₹{route.fare}
                </option>
              ))}
            </select>
          </div>

          {/* Display Selected Route Details */}
          {selectedRoute && (
            <div className="p-4 bg-gray-100 rounded-md mb-4">
              <p><strong>Route:</strong> {selectedRoute.start} → {selectedRoute.end}</p>
              <p><strong>Fare:</strong> ₹{selectedRoute.fare}</p>
            </div>
          )}

          {/* Buy Pass Button */}
          <button
            onClick={buyPass}
            className="bg-blue-500 text-white p-3 rounded w-full text-lg font-semibold hover:bg-blue-600 transition"
            disabled={!selectedRoute || loading}
          >
            {loading ? "Processing..." : expired ? "Renew Pass" : "Buy Pass"}
          </button>
        </>
      )}
    </div>
  );
}
