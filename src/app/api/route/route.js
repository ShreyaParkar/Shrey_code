import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Route from "@/lib/models/ticketing/route.model";

export async function GET() {
  try {
    await connect();
    const routes = await Route.find();
    return NextResponse.json(routes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connect();
    const { start, end, fare } = await req.json();

    if (!start || !end || fare === undefined) {
      return NextResponse.json({ error: "All fields (start, end, fare) are required" }, { status: 400 });
    }

    const newRoute = await Route.create({ start, end, fare });
    return NextResponse.json(newRoute);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
