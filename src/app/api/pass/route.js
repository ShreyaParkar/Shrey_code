import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Pass from "@/lib/models/pass/pass.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Fetch user's current pass (only active ones)
export async function GET(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // ✅ Find the latest active pass
    const pass = await Pass.findOne({
      userId,
      expiryDate: { $gte: new Date() }, // ✅ Only non-expired passes
    }).populate("routeId", "start end fare");

    if (!pass) {
      return NextResponse.json({ expired: true, message: "No active pass found" }, { status: 404 });
    }

    return NextResponse.json(pass, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching pass:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Confirm payment & generate pass after successful checkout
export async function POST(req) {
  try {
    await connect();
    const { userId, routeId, fare, sessionId } = await req.json();

    if (!userId || !routeId || fare === undefined || !sessionId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // ✅ Verify the Stripe payment session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 400 });
    }

    // ✅ Check if the user already has an active pass
    const existingPass = await Pass.findOne({
      userId,
      expiryDate: { $gte: new Date() }, // ✅ Only check for non-expired passes
    });

    if (existingPass) {
      return NextResponse.json({ error: "You already have an active pass" }, { status: 400 });
    }

    // ✅ Set pass expiration (1 month validity)
    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    // ✅ Create the new pass
    const newPass = await Pass.create({ userId, routeId, fare, purchaseDate, expiryDate });

    return NextResponse.json({ success: true, pass: newPass }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating pass:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
.