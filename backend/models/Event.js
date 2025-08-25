import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String },
  text: { type: String, required: true },
  done: { type: Boolean, default: false }
})

export default mongoose.model("Event", eventSchema)