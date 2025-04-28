import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import PassUsage from "@/lib/models/pass/passUsage.model";
import Pass from "@/lib/models/pass/pass.model";

// ✅ Verify pass and store scan data
export async function POST(req) {
  try {
    await connect();
    const { userId, passId, location } = await req.json();

    if (!userId || !passId) {
      return NextResponse.json({ error: "User ID and Pass ID are required" }, { status: 400 });
    }

    // ✅ Check if the pass is still valid
    const pass = await Pass.findById(passId);
    if (!pass || new Date() > new Date(pass.expiryDate)) {
      return NextResponse.json({ error: "Pass is expired or invalid" }, { status: 400 });
    }

    // ✅ Store pass usage
    const newUsage = await PassUsage.create({ userId, passId, location });

    return NextResponse.json({ message: "Pass verified successfully", usage: newUsage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
