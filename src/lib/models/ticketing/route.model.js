import mongoose from "mongoose";

const RouteSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  fare: { type: Number, required: true }, // Ensure fare is required
});

export default mongoose.models.Route || mongoose.model("Route", RouteSchema);
