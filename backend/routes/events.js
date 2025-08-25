import express from "express";
import Event from "../models/Event.js";
import { authenticationUser } from "./auth.js"

const router = express.Router();

// hämta alla events för inloggad user
router.get("/events", authenticationUser, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" })

  }

});

// skapa nytt event
router.post("/events", authenticationUser, async (req, res) => {
  try {
    const { date, time, text, done } = req.body;
    const event = new Event({ userId: req.user._id, date, time, text, done });
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to create event" })
  }
});

// uppdatera event
router.put("/events/:id", authenticationUser, async (req, res) => {
  try {
    const updated = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: "Failed to update event" })
  }

});

// ta bort event
router.delete("/events/:id", authenticationUser, async (req, res) => {
  try {
    await Event.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" })
  }

});

export default router;