import express from "express";
import Campaign from "../models/newcompaingmodel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;
  console.log("Received startDate:", startDate, "endDate:", endDate);

  try {
    let campaigns;
    if (startDate && endDate) {
      // Convert dates to 'YYYY-MM-DD' format
      const parsedStartDate = new Date(startDate).toISOString().split('T')[0];
      const parsedEndDate = new Date(endDate).toISOString().split('T')[0];

      console.log("Parsed startDate:", parsedStartDate, "Parsed endDate:", parsedEndDate);

      campaigns = await Campaign.find({
        entryDate: {
          $gte: parsedStartDate,
          $lte: parsedEndDate
        }
      }).exec();
    } else {
      campaigns = await Campaign.find();
    }
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single campaign
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new campaign
router.post("/", async (req, res) => {
  const {
    adFormat,
    id,
    adFor,
    campaignName,
    campaignBid,
    geo,
    compaignImage,
    bidRequests,
    videoImp,
    visits,
    winRate,
    cost,
    dailyCap,
    title,
    descriptionone,
    descriptiontwo,
    displayURL,
  } = req.body;

  const campaign = new Campaign({
    adFormat,
    id,
    adFor,
    campaignName,
    campaignBid,
    geo,
    bidRequests,
    videoImp,
    visits,
    winRate,
    cost,
    compaignImage,
    dailyCap,
    title,
    descriptionone,
    descriptiontwo,
    displayURL,
  });

  try {
    const newCampaign = await campaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT/update a campaign
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedCampaign = await Campaign.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(updatedCampaign);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a campaign
router.delete("/:id", async (req, res) => {
  try {
    const removedCampaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!removedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({ message: "Campaign deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
