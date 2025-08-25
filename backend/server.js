import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import plantRouter from "./routes/plants.js"
import "./models/user.js"
import eventRoutes from "./routes/events.js"


dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const port = process.env.PORT || 8080;
const app = express();


app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:8080",
    "https://lillebrorgrodafinalproject.netlify.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization']


}))
app.use(express.json())

app.use(authRoutes)
app.use(plantRouter)
app.use("/api", eventRoutes)

//Routes

app.get("/", (req, res) => {
  res.json({
    message: "Garden Backend API",
    status: "running",
    endpoints: ["/signup", "/login", "/plants", "/calendar"]
  })
})



app.get("/plants", (req, res) => {
  res.send("Gets plants")
})

app.get("/calendar", (req, res) => {
  const month = req.query
  res.send(`calender for month ${month}`)
}) //Kolla endpoint

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
