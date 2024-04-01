import express from "express";
import Analytics from "../models/dailactivitymodel.js";

const router = express.Router();

// GET all analytics
router.get("/", async (req, res) => {
  try {
    const analytics = await Analytics.find();
    res.status(200).json(analytics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single analytics by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const analytics = await Analytics.findById(id);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(404).json({ message: "Analytics not found" });
  }
});

// POST a new analytics
router.post("/", async (req, res) => {
  const analytics = new Analytics(req.body);

  try {
    const newAnalytics = await analytics.save();
    res.status(201).json(newAnalytics);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT/update analytics by ID
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedAnalytics = await Analytics.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedAnalytics) {
      return res.status(404).json({ message: "Analytics not found" });
    }
    res.json(updatedAnalytics);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE analytics by ID
router.delete("/:id", async (req, res) => {
  try {
    const removedAnalytics = await Analytics.findByIdAndDelete(req.params.id);
    if (!removedAnalytics) {
      return res.status(404).json({ message: "Analytics not found" });
    }
    res.status(200).json({ message: "Analytics deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
