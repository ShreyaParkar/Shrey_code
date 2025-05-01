import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connect } from "@/lib/mongodb/mongoose";
import Ticket from "@/lib/models/ticketing/ticket.model";
import Station from "@/lib/models/ticketing/stations.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await connect();

    const { sessionId, userId, stationId, busId } = await req.json();

    console.log("📥 Incoming ticket POST:", { sessionId, userId, stationId, busId });

    if (!sessionId || !userId || !stationId || !busId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 400 });
    }

    const station = await Station.findById(stationId).populate("route");
    if (!station || !station.route) {
      return NextResponse.json({ error: "Station or route not found" }, { status: 404 });
    }

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // 24-hour validity

    const newTicket = await Ticket.create({
      userId,
      routeId: station.route._id,
      busId,
      startStation: station.route.start,
      endStation: station.route.end,
      price: station.fare,
      paymentIntentId: session.payment_intent,
      expiryDate,
    });

    return NextResponse.json({ success: true, ticket: newTicket }, { status: 201 });
  } catch (error) {
    console.error("❌ Ticket Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
    try {
      await connect();
  
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
  
      if (!userId || userId.trim() === "") {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }
  
      const tickets = await Ticket.find({ userId })
        .sort({ createdAt: -1 })
        .populate("routeId", "start end")
        .populate("busId", "name");
  
      return NextResponse.json(tickets, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  