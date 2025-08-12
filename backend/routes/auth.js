import express from "express"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import User from "../models/user.js"

dotenv.config()

const router = express.Router()

// 🧠 Middleware – kontrollera accessToken
export const authenticationUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization

    if (!accessToken) {
      return res.status(401).json({ loggedOut: true, message: "Access token missing" })
    }

    const user = await User.findOne({ accessToken })

    if (user) {
      req.user = user
      next()
    } else {
      res.status(401).json({ loggedOut: true, message: "Unauthorized: invalid token" })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// 🔐 Register user
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      })
    }

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    res.status(201).json({
      success: true,
      userId: newUser._id,
      accessToken: newUser.accessToken,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not create user",
      error: error.message,
    })
  }
})

// 🔓 Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" })
    }

    res.status(200).json({
      success: true,
      userId: user._id,
      accessToken: user.accessToken,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed", error: error.message })
  }
})

export default router

