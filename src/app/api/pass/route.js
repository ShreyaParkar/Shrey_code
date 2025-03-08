import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Pass from "@/lib/models/pass/pass.model";

// ✅ Fetch user's current pass (check if expired)
export async function GET(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const pass = await Pass.findOne({ userId }).populate("routeId", "start end fare");

    // Check if the pass is expired
    if (pass && new Date() > new Date(pass.expiryDate)) {
      return NextResponse.json({ expired: true }, { status: 200 });
    }

    return NextResponse.json(pass || { expired: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Buy a new pass (valid for 1 month)
export async function POST(req) {
  try {
    await connect();
    const { userId, routeId, fare } = await req.json();

    if (!userId || !routeId || fare === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const purchaseDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // ✅ Set expiry 1 month later

    const newPass = await Pass.create({ userId, routeId, fare, purchaseDate, expiryDate });

    return NextResponse.json(newPass, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
