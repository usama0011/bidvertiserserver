import express from "express";
import DailyActivity from "../models/dailactivitymodel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { startDate, endDate, selectedCampaign } = req.query;
  console.log(req.query);
  console.log("Received startDate:", startDate, "endDate:", endDate);

  try {
    let campaigns;

    if (startDate && endDate) {
      // Convert startDate and endDate from 'MM/DD/YYYY' to 'YYYY-MM-DD'
      const [startMonth, startDay, startYear] = startDate.split("/");
      const [endMonth, endDay, endYear] = endDate.split("/");

      // Create Date objects in the format 'YYYY-MM-DD'
      const parsedStartDate = new Date(
        `${startYear}-${startMonth}-${startDay}`
      );
      const parsedEndDate = new Date(`${endYear}-${endMonth}-${endDay}`);

      // Adjust endDate to include the entire day
      parsedEndDate.setHours(23, 59, 59, 999);
      const query = {
        Date: {
          $gte: parsedStartDate.toISOString().split("T")[0], // Format as 'YYYY-MM-DD'
          $lte: parsedEndDate.toISOString().split("T")[0], // Format as 'YYYY-MM-DD'
        },
      };
      if (selectedCampaign) {
        query.campaignname = selectedCampaign;
      }

      // Find documents with Date within the range
      campaigns = await DailyActivity.find(query).exec();
    } else {
      // Fetch all campaigns if no date range is provided
      campaigns = await DailyActivity.find();
    }

    res.status(200).json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET /fetchcampaignnames
router.get("/fetchcampaignnames/dailiyactivity", async (req, res) => {
  try {
    // Fetch distinct campaign names from the DailyActivity collection
    const campaignNames = await DailyActivity.distinct("campaignname");

    // Optionally, remove duplicates using Set to ensure uniqueness
    const uniqueCampaignNames = [...new Set(campaignNames)];

    res.status(200).json(uniqueCampaignNames);
  } catch (err) {
    console.error("Error fetching campaign names:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// API to fetch aggregated data
router.get("/aggrigation-summary", async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
    console.log("Received Dates:", startDate, endDate);

    // Convert MM/DD/YYYY to DD-MM-YYYY
    const convertDateFormat = (dateStr) => {
      const [month, day, year] = dateStr.split("/");
      return `${day}-${month}-${year}`; // Convert to DD-MM-YYYY
    };

    startDate = convertDateFormat(startDate);
    endDate = convertDateFormat(endDate);

    console.log("Converted Dates:", startDate, endDate);
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required." });
    }

    // MongoDB Aggregation Pipeline
    const result = await DailyActivity.aggregate([
      {
        $match: {
          Date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$campaignname",
          totalBidRequest: { $sum: { $toInt: "$BidRequest" } },
          totalVisits: { $sum: { $toInt: "$Vistis" } },
          totalCost: { $sum: { $toDouble: "$Cost" } },
          totalCPC: { $sum: { $toDouble: "$CPC" } },
          entryCount: { $sum: 1 }, // Count number of entries per campaign
        },
      },
      {
        $project: {
          _id: 0,
          campaignname: "$_id",
          AdRequests: "$totalBidRequest",
          Visits: "$totalVisits",
          Cost: "$totalCost",
          CPC: { $divide: ["$totalCPC", "$entryCount"] }, // Calculate the average CPC
        },
      },
    ]);

    res.json({
      totalCampaigns: result.length,
      startDate,
      endDate,
      campaigns: result,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET a single analytics by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const analytics = await DailyActivity.findById(id);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(404).json({ message: "Analytics not found" });
  }
});

// POST a new analytics
router.post("/", async (req, res) => {
  const analytics = new DailyActivity(req.body);

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
    const updatedAnalytics = await DailyActivity.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
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
    const removedAnalytics = await DailyActivity.findByIdAndDelete(
      req.params.id
    );
    if (!removedAnalytics) {
      return res.status(404).json({ message: "Analytics not found" });
    }
    res.status(200).json({ message: "Analytics deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
