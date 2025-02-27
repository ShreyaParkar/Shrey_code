import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connect } from "@/lib/mongodb/mongoose";
import TicketModel from "@/lib/models/ticketing/ticket.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await connect();
  const { start, end, fare } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ 
      price_data: { 
        currency: "inr", 
        unit_amount: fare * 100, 
        product_data: { name: "Bus Ticket" } 
      }, 
      quantity: 1 
    }],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/ticket`,
  });

  await TicketModel.create({ start, end, fare, stripeSessionId: session.id });

  return NextResponse.json({ sessionId: session.id });
}
