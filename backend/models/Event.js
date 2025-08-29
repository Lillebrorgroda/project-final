import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String },
  text: { type: String, required: true },
  done: { type: Boolean, default: false }
}, {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    }
  }
})

export default mongoose.model("Event", eventSchema)