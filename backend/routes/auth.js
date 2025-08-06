
import express from "express"
import bcrypt from "bcrypt"
import crypto from "crypto"
import User from "../models/user.js"
import dotenv from "dotenv"

dotenv.config()

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET


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



// Register new user

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body
    const user = new User({
      username,
      password: await bcrypt.hashSync(password), // Hash the password
      email
    })
    await user.save()
    res.status(201).json({
      id: user._id,
      accessToken: user.accessToken,

    })
  } catch (error) {
    if (!User) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
        error: error.message
      })
    }
  }
})

// Login

router.post("/login", async (req, res) => {

  const user = await User.findOne({ email: req.body.email })
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.json({ userId: user._id, accessToken: user.accessToken })
  } else {
    res.status(401).json({ notFound: true, message: "Invalid email or password" })
  }
})

export default router
