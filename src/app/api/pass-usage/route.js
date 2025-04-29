import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import PassUsage from "@/lib/models/pass/passUsage.model";
import Pass from "@/lib/models/pass/pass.model";

// ✅ GET: Fetch pass usage history
export async function GET(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const usageHistory = await PassUsage.find({ userId })
      .sort({ scannedAt: -1 })
      .populate({
        path: "passId",
        populate: {
          path: "routeId",
          select: "start end"
        }
      });

    return NextResponse.json(usageHistory, { status: 200 });
  } catch (error) {
    console.error("Error fetching pass usage:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST: Scan and store pass usage
export async function POST(req) {
  try {
    await connect();
    const { userId, passId, location } = await req.json();

    if (!userId || !passId) {
      return NextResponse.json({ error: "User ID and Pass ID are required" }, { status: 400 });
    }

    const pass = await Pass.findById(passId);
    if (!pass || new Date() > new Date(pass.expiryDate)) {
      return NextResponse.json({ error: "Pass is expired or invalid" }, { status: 400 });
    }

    const newUsage = await PassUsage.create({ userId, passId, location });

    return NextResponse.json({ message: "Pass verified successfully", usage: newUsage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
