import express from "express";
import Event from "../models/Event.js";
import { authenticationUser } from "./auth.js"

const router = express.Router();

// hämta alla events för inloggad user
router.get("/", authenticationUser, async (req, res) => {
  const events = await Event.find({ userId: req.user._id });
  res.json(events);
});

// skapa nytt event
router.post("/", authenticationUser, async (req, res) => {
  const { date, time, text, done } = req.body;
  const event = new Event({ userId: req.user._id, date, time, text, done });
  await event.save();
  res.json(event);
});

// uppdatera event
router.put("/:id", authenticationUser, async (req, res) => {
  const updated = await Event.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

// ta bort event
router.delete("/:id", authenticationUser, async (req, res) => {
  await Event.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ success: true });
});

export default router;