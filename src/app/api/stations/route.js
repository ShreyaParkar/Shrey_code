import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Station from "@/lib/models/ticketing/stations.model";
import Bus from "@/lib/models/ticketing/bus.model";

// ✅ Get stations for a specific route & bus
export async function GET(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const routeId = searchParams.get("routeId");
    const busId = searchParams.get("busId");

    let query = {};
    if (routeId) query.routeId = routeId;
    if (busId) query.busId = busId;

    const stations = await Station.find(query)
      .populate("routeId", "start end") // ✅ Populate route details
      .populate("busId", "name"); // ✅ Populate bus details

    return NextResponse.json(stations, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Fetch buses assigned to a specific route
export async function GET_BUSES(req) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const routeId = searchParams.get("routeId");

    if (!routeId) {
      return NextResponse.json({ error: "Route ID is required" }, { status: 400 });
    }

    const buses = await Bus.find({ route: routeId }); // ✅ Fetch only buses under the selected route
    return NextResponse.json(buses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Create a new station
export async function POST(req) {
  try {
    await connect();
    const { routeId, busId, name, latitude, longitude, fare } = await req.json();

    if (!routeId || !busId || !name || latitude === undefined || longitude === undefined || fare === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newStation = await Station.create({ routeId, busId, name, latitude, longitude, fare });

    return NextResponse.json(newStation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update station details
export async function PUT(req) {
  try {
    await connect();
    const { id, routeId, busId, name, latitude, longitude, fare } = await req.json();

    if (!id || !routeId || !busId || !name || latitude === undefined || longitude === undefined || fare === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const updatedStation = await Station.findByIdAndUpdate(
      id,
      { routeId, busId, name, latitude, longitude, fare },
      { new: true }
    );

    if (!updatedStation) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    return NextResponse.json(updatedStation, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete a station
export async function DELETE(req) {
  try {
    await connect();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Station ID is required" }, { status: 400 });
    }

    const deletedStation = await Station.findByIdAndDelete(id);

    if (!deletedStation) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Station deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
