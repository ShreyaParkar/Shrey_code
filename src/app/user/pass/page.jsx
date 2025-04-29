"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

export default function BuyPassPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passQR, setPassQR] = useState("");
  const [hasPass, setHasPass] = useState(false);
  const [expired, setExpired] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchRoutes();
    checkUserPass();

    const paymentStatus = searchParams.get("status");
    const sessionId = searchParams.get("session_id");

    if (paymentStatus === "success" && sessionId) {
      const storedRoute = localStorage.getItem("selectedRoute");
      if (storedRoute) {
        const parsed = JSON.parse(storedRoute);
        confirmPayment(sessionId, parsed);
      }
    } else if (paymentStatus === "cancel") {
      showTemporaryMessage("cancel");
    }
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
        setPassQR(JSON.stringify({
          userId: data.userId,
          route: `${data.routeId.start} → ${data.routeId.end}`,
          fare: data.fare,
          validTill: data.expiryDate
        }));
        setHasPass(true);
        setExpired(false);
      }
    } catch (error) {
      console.error("Error fetching pass:", error);
    }
  }

  async function confirmPayment(sessionId, routeData) {
    try {
      const res = await fetch("/api/pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          routeId: routeData._id,
          fare: routeData.fare,
          sessionId
        }),
      });

      const data = await res.json();
      if (data.success) {
        showTemporaryMessage("success");
        localStorage.removeItem("selectedRoute");
        checkUserPass();
      } else {
        showTemporaryMessage("error");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  }

  async function buyPass() {
    if (!selectedRoute || !user?.id) {
      alert("Please select a route.");
      return;
    }

    // ✅ Store selectedRoute in localStorage before redirect
    localStorage.setItem("selectedRoute", JSON.stringify(selectedRoute));

    setLoading(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pass",
          userId: user.id,
          routeId: selectedRoute._id,
          fare: selectedRoute.fare,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment failed.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
    setLoading(false);
  }

  function showTemporaryMessage(type) {
    setStatus(type);
    setTimeout(() => setStatus(null), 3000);
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        🎫 Buy Monthly Travel Pass
      </h1>

      {status === "success" && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
          ✅ Payment Successful! Your pass is now active.
        </div>
      )}
      {status === "cancel" && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
          ❌ Payment Canceled. Please try again.
        </div>
      )}

      {hasPass && !expired ? (
        <div className="flex flex-col items-center bg-gray-100 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Your Pass QR Code</h2>
          <QRCodeCanvas value={passQR} size={200} />
          <p className="mt-2 text-sm text-gray-600">
            Valid until: {new Date(JSON.parse(passQR).validTill).toDateString()}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block font-medium mb-1">Select Route:</label>
            <select
              onChange={(e) =>
                setSelectedRoute(routes.find((r) => r._id === e.target.value))
              }
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

          {selectedRoute && (
            <div className="p-4 bg-gray-100 rounded-md mb-4">
              <p>
                <strong>Route:</strong> {selectedRoute.start} → {selectedRoute.end}
              </p>
              <p>
                <strong>Fare:</strong> ₹{selectedRoute.fare}
              </p>
            </div>
          )}

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
