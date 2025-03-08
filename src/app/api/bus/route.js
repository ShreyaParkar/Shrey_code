import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Bus from "@/lib/models/ticketing/bus.model";
import Route from "@/lib/models/ticketing/route.model"; // ✅ Import Route model

// ✅ GET all buses (Populating route details)
export async function GET(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const routeId = searchParams.get("routeId"); // ✅ Fetch only buses of a specific route

    let query = {};
    if (routeId) query.route = routeId;

    const buses = await Bus.find(query).populate("route", "start end"); // ✅ Populate route details

    return NextResponse.json(buses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST a new bus (Ensuring Route Exists)
export async function POST(req) {
  try {
    await connect();
    const { name, route, capacity } = await req.json();

    // ✅ Ensure the route exists
    const existingRoute = await Route.findById(route);
    if (!existingRoute) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    const newBus = await Bus.create({ name, route, capacity });

    return NextResponse.json(newBus, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT (Update a bus)
export async function PUT(req) {
  try {
    await connect();
    const { id, name, route, capacity } = await req.json();

    if (!id || !name || !route || capacity === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // ✅ Ensure the route exists
    const existingRoute = await Route.findById(route);
    if (!existingRoute) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    const updatedBus = await Bus.findByIdAndUpdate(
      id,
      { name, route, capacity },
      { new: true }
    ).populate("route", "start end"); // ✅ Populate route after update

    if (!updatedBus) {
      return NextResponse.json({ error: "Bus not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBus, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE a bus
export async function DELETE(req) {
  try {
    await connect();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Bus ID is required" }, { status: 400 });
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
