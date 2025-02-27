import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb/mongoose";
import Station from "@/lib/models/ticketing/station.model";

export async function GET() {
  await connectDB();
  const stations = await Station.find().populate("route");
  return NextResponse.json(stations);
}

export async function POST(req) {
  await connectDB();
  const { name, route } = await req.json();
  const newStation = await Station.create({ name, route });
  return NextResponse.json(newStation);
}
