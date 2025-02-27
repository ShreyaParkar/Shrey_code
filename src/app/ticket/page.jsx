"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const TicketPage = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [fare, setFare] = useState(null);
  const [status, setStatus] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchRoutes();

    // Check URL for success or cancel messages
    if (searchParams.get("status") === "success") {
      setStatus("success");
    } else if (searchParams.get("status") === "cancel") {
      setStatus("cancel");
    }
  }, []);

  const fetchRoutes = async () => {
    const res = await fetch("/api/route");
    const data = await res.json();
    setRoutes(data);
  };

  const handlePayment = async () => {
    if (!selectedRoute) return;

    const res = await fetch("/api/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route: selectedRoute }),
    });

    const { url } = await res.json();
    if (url) {
      window.location.href = url; // Redirect to Stripe Checkout
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Book Your Ticket</h1>

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

      <select
        onChange={(e) => setSelectedRoute(JSON.parse(e.target.value))}
        className="border p-2 w-full mt-2"
      >
        <option value="">Select a Route</option>
        {routes.map((route) => (
          <option key={route._id} value={JSON.stringify(route)}>
            {route.start} → {route.end} | ₹{route.fare}
          </option>
        ))}
      </select>

      <button
        onClick={handlePayment}
        className="mt-3 bg-blue-500 text-white p-2 rounded w-full"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default TicketPage;
