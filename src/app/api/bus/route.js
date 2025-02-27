import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/lib/mongodb/mongoose";
import Bus from "@/lib/models/ticketing/bus.model";
import Route from "@/lib/models/ticketing/route.model"; // Import Route model

// ✅ GET - Fetch all buses with populated route data
export async function GET() {
  try {
    await connect();
    const buses = await Bus.find().populate({ path: "route", select: "start end" }); // Fetch only 'start' and 'end' fields
    return NextResponse.json(buses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST - Add a new bus
export async function POST(req) {
  try {
    await connect();
    const { name, route, capacity } = await req.json();

    if (!name || !route || !capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(route)) {
      return NextResponse.json({ error: "Invalid Route ID" }, { status: 400 });
    }

    const newBus = await Bus.create({ name, route, capacity });
    return NextResponse.json(newBus, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT - Update a bus by ID
export async function PUT(req) {
  try {
    await connect();
    const { id, name, route, capacity } = await req.json();

    if (!id || !name || !route || !capacity) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(route)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const updatedBus = await Bus.findByIdAndUpdate(id, { name, route, capacity }, { new: true }).populate({
      path: "route",
      select: "start end",
    });

    if (!updatedBus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBus, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE - Remove a bus by ID (Fixing the 400 error)
export async function DELETE(req) {
  try {
    await connect();
    const { id } = await req.json(); // Extract id from body

    if (!id) {
      return NextResponse.json({ error: "Bus ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid Bus ID format" }, { status: 400 });
    }

    const deletedBus = await Bus.findByIdAndDelete(id);
    if (!deletedBus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bus deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
