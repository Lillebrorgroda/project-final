import mongoose from "mongoose"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
    trim: true,
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
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'],
  },
  savedPlants: [{
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant"
    },
    savedAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      maxlength: 500
    }
  }],
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  }
}, {
  timestamps: true // 
})

// Index 
//userSchema.index({ email: 1 });
userSchema.index({ accessToken: 1 });

const User = mongoose.model("User", userSchema)

export default User