import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connect } from "@/lib/mongodb/mongoose";
import Pass from "@/lib/models/pass/pass.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  try {
    await connect();
    const { userId, routeId, fare } = await req.json();

    if (!userId || !routeId || !fare) {
      return NextResponse.json({ error: "Invalid pass details" }, { status: 400 });
    }

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/pass?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/pass?status=cancel`,
      customer_email: userId, // ✅ Clerk user ID used as email
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Monthly Travel Pass" },
            unit_amount: fare * 100, // Convert to paise
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
