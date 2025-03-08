import mongoose from "mongoose";

const StationSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus", // ✅ Now we track which bus the station belongs to
    required: true,
  },
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  fare: { type: Number, required: true },
});

export default mongoose.models.Station || mongoose.model("Station", StationSchema);
