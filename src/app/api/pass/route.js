import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Pass from "@/lib/models/pass/pass.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ GET: Fetch Active Pass
export async function GET(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const pass = await Pass.findOne({
      userId,
      expiryDate: { $gte: new Date() },
    }).populate("routeId", "start end fare");

    if (!pass) {
      return NextResponse.json({ expired: true, message: "No active pass found" }, { status: 404 });
    }

    return NextResponse.json(pass, { status: 200 });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST: Confirm Stripe Payment and Create Pass
export async function POST(req) {
  try {
    await connect();
    const { userId, routeId, fare, sessionId } = await req.json();

    if (!userId || !routeId || fare === undefined || !sessionId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 400 });
    }

    const existingPass = await Pass.findOne({
      userId,
      expiryDate: { $gte: new Date() },
    });

    if (existingPass) {
      return NextResponse.json({ error: "User already has an active pass" }, { status: 400 });
    }

    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const newPass = await Pass.create({
      userId,
      routeId,
      fare,
      purchaseDate,
      expiryDate,
    });

    return NextResponse.json({ success: true, pass: newPass });
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
