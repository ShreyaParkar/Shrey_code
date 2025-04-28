import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connect } from "@/lib/mongodb/mongoose";
import PassModel from "@/lib/models/pass";
import PaymentModel from "@/lib/models/pass/payment.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await connect();
    const { type, userId, routeId, fare, sessionId } = await req.json();

    // ✅ Step 1: Confirm Payment if sessionId is provided
    if (sessionId) {
      return await confirmPayment(sessionId);
    }

    // ✅ Step 2: Create Stripe Checkout Session
    if (!type || !fare || !routeId) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    }

    let successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/user/pass?status=success&session_id={CHECKOUT_SESSION_ID}`;
    let cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/user/pass?status=cancel`;

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: fare * 100,
            product_data: { name: `Monthly Travel Pass for Route ${routeId}` },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // ✅ Store pending payment in DB
    await PaymentModel.create({
      userId,
      type,
      routeId,
      fare,
      stripeSessionId: session.id,
      status: "pending",
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

// ✅ Step 3: Confirm Payment & Generate Pass
async function confirmPayment(sessionId) {
  try {
    await connect();

    // ✅ Verify Stripe payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 400 });
    }

    // ✅ Find pending payment in DB
    const payment = await PaymentModel.findOne({ stripeSessionId: sessionId });
    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    // ✅ Ensure user does not already have an active pass
    const existingPass = await PassModel.findOne({
      userId: payment.userId,
      expiryDate: { $gte: new Date() },
    });

    if (existingPass) {
      return NextResponse.json({ error: "User already has an active pass" }, { status: 400 });
    }

    // ✅ Create new pass
    const newPass = await PassModel.create({
      userId: payment.userId,
      routeId: payment.routeId,
      fare: payment.fare,
      purchaseDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // ✅ Update payment status
    await PaymentModel.updateOne({ stripeSessionId: sessionId }, { status: "completed" });

    return NextResponse.json({ success: true, pass: newPass });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
