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


app.use(cors())
app.use(express.json())

app.use(authRoutes)
app.use(plantRouter)
app.use(eventRoutes)

//Routes

app.get("/", (req, res) => {
  res.json({
    message: "Garden Backend API",
    status: "running",
    endpoints: ["/signup", "/login", "/plants", "/account"]
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
