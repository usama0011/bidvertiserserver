import express from "express";
import Summary from "../models/summarymodel.js";

const router = express.Router();

// GET all summaries
router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;
  console.log(req.query);
  console.log("Received startDate:", startDate, "endDate:", endDate);

  try {
    let campaigns;
    if (startDate && endDate) {
      // Convert startDate and endDate from 'mm/dd/yyyy' to 'yyyy-mm-dd'
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      // Adjust the endDate to include the entire day
      parsedEndDate.setHours(23, 59, 59, 999);

      campaigns = await Summary.find({
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
router.get("/fetchcampaignnames/summery", async (req, res) => {
  try {
    // Fetch distinct campaign names from the Summary collection
    const campaignNames = await Summary.distinct("campaignname");

    res.status(200).json(campaignNames);
  } catch (err) {
    console.error("Error fetching campaign names:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// GET a single summary
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const summaries = await Summary.findById(id);
    res.status(200).json(summaries);
  } catch (error) {}
});

// POST a new summary
router.post("/", async (req, res) => {
  const summary = new Summary({
    startdate: req.body.startdate,
    endDate: req.body.endDate,
    AdRequests: req.body.AdRequests,
    campaignname: req.body.campaignname,
    Visits: req.body.Visits,
    Cost: req.body.Cost,
    CPC: req.body.CPC,
  });

  try {
    const newSummary = await summary.save();
    res.status(201).json(newSummary);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT/update a summary
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedSummary = await Summary.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSummary) {
      return res.status(404).json({ message: "Summary not found" });
    }
    res.json(updatedSummary);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a summary
router.delete("/:id", async (req, res) => {
  try {
    const removesummery = await Summary.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Summary deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
