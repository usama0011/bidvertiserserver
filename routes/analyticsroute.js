import express from "express";
import Analytics from "../models/analyticsmodel.js";

const router = express.Router();

// GET all analytics
// Backend route
router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;
  console.log(req.query);
  console.log("Received startDate:", startDate, "endDate:", endDate);

  try {
    let campaigns;

    if (startDate && endDate) {
      // Convert startDate and endDate from 'mm/dd/yyyy' to 'yyyy-mm-dd'
      const [startMonth, startDay, startYear] = startDate.split("/");
      const [endMonth, endDay, endYear] = endDate.split("/");

      const parsedStartDate = new Date(
        `${startYear}-${startMonth}-${startDay}`
      );
      const parsedEndDate = new Date(`${endYear}-${endMonth}-${endDay}`);

      // Adjust the endDate to include the entire day
      parsedEndDate.setHours(23, 59, 59, 999);

      campaigns = await Analytics.find({
        Date: {
          $gte: parsedStartDate,
          $lte: parsedEndDate,
        },
      }).exec();
    } else {
      campaigns = await Analytics.find();
    }

    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /fetchcampaignnames
router.get("/fetchcampaignnames/analytics", async (req, res) => {
  try {
    // Fetch distinct campaign names from the Summary collection
    const campaignNames = await Analytics.distinct("campaignname");

    res.status(200).json(campaignNames);
  } catch (err) {
    console.error("Error fetching campaign names:", err);
    res.status(500).json({ message: "Internal server error" });
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
