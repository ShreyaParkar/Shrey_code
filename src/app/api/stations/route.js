import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Station from "@/lib/models/ticketing/stations.model";

// 📌 Handle GET (Fetch All Stations) & POST (Create a Station)
export async function GET(req) {
  try {
    await connect();
    
    // Get stations, populated with route details
    const stations = await Station.find().populate("routeId");

    return NextResponse.json(stations, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📌 Create a New Station
export async function POST(req) {
  try {
    await connect();
    const { routeId, name, latitude, longitude } = await req.json();

    if (!routeId || !name || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "All fields (routeId, name, latitude, longitude) are required" }, { status: 400 });
    }

    const newStation = await Station.create({ routeId, name, latitude, longitude });

    return NextResponse.json(newStation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📌 Handle PUT (Update a Station) & DELETE (Delete a Station)
export async function PUT(req) {
  try {
    await connect();
    const { id, routeId, name, latitude, longitude } = await req.json();

    if (!id || !routeId || !name || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "All fields (id, routeId, name, latitude, longitude) are required" }, { status: 400 });
    }

    const updatedStation = await Station.findByIdAndUpdate(id, { routeId, name, latitude, longitude }, { new: true });

    if (!updatedStation) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 });
    }

    return NextResponse.json(updatedStation, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 📌 Delete a Station
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