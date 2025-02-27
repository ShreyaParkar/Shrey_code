import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Route from "@/lib/models/ticketing/route.model";

// GET all routes
export async function GET() {
  try {
    await connect();
    const routes = await Route.find();
    return NextResponse.json(routes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new route
export async function POST(req) {
  try {
    await connect();
    const body = await req.json();  // Get the request body

    if (!body.start || !body.end || body.fare === undefined) {
      return NextResponse.json({ error: "All fields (start, end, fare) are required" }, { status: 400 });
    }

    const newRoute = await Route.create({
      start: body.start,
      end: body.end,
      fare: body.fare
    });

    return NextResponse.json(newRoute, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT (Update a route)
export async function PUT(req) {
  try {
    await connect();
    const body = await req.json();
    const { id, start, end, fare } = body;

    if (!id || !start || !end || fare === undefined) {
      return NextResponse.json({ error: "All fields (id, start, end, fare) are required" }, { status: 400 });
    }

    const updatedRoute = await Route.findByIdAndUpdate(id, { start, end, fare }, { new: true });

    if (!updatedRoute) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    return NextResponse.json(updatedRoute, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a route
export async function DELETE(req) {
  try {
    await connect();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Route ID is required" }, { status: 400 });
    }

    const deletedRoute = await Route.findByIdAndDelete(id);

    if (!deletedRoute) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Route deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
