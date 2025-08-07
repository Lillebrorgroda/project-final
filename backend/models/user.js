import mongoose from "mongoose"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  savedPlants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plant"
  }],
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
})

const User = mongoose.model("User", userSchema)

export default User