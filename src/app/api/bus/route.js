import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/lib/mongodb/mongoose";
import Bus from "@/lib/models/ticketing/bus.model";

// GET - Fetch all buses
export async function GET() {
  try {
    await connect();
    const buses = await Bus.find().populate("route"); // Ensure it fetches full route details
    return NextResponse.json(buses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add a new bus
export async function POST(req) {
  try {
    await connect();
    const { name, route, capacity } = await req.json();

    if (!name || !route || !capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newBus = await Bus.create({ name, route, capacity });
    return NextResponse.json(newBus, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a bus by ID
export async function DELETE(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const busId = searchParams.get("id");

    console.log("Received Bus ID:", busId); // Debugging Log

    if (!busId) {
      return NextResponse.json({ error: "Bus ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return NextResponse.json({ error: "Invalid Bus ID format" }, { status: 400 });
    }

    const deletedBus = await Bus.findByIdAndDelete(busId);
    if (!deletedBus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bus deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting bus", details: error.message }, { status: 500 });
  }
}
