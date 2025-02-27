import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  start: { type: Object, required: true },
  end: { type: Object, required: true },
  fare: { type: Number, required: true },
  stripeSessionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
