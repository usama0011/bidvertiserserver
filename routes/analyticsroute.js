import express from "express";
import Analytics from "../models/analyticsmodel.js";

const router = express.Router();

// GET all analytics
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

      // Log the parsed dates for debugging
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
      campaigns = await Analytics.find(query).exec();
    } else {
      // Fetch all campaigns if no date range is provided
      campaigns = await Analytics.find();
    }

    res.status(200).json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET /fetchcampaignnames
router.get("/fetchcampaignnames/analytics", async (req, res) => {
  try {
    // Fetch distinct campaign names from the DailyActivity collection
    const campaignNames = await Analytics.distinct("campaignname");

    // Optionally, remove duplicates using Set to ensure uniqueness
    const uniqueCampaignNames = [...new Set(campaignNames)];

    res.status(200).json(uniqueCampaignNames);
  } catch (err) {
    console.error("Error fetching campaign names:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET API to fetch analytics data for the last two days from the given range and generate 24 hourly rows per day
router.get("/getAnalyticsByDateRange", async (req, res) => {
  try {
    let { startDate, endDate, campaignname } = req.query;
    console.log(
      "Received startDate:",
      startDate,
      "endDate:",
      endDate,
      "campaignname:",
      campaignname
    );

    // Validate input dates
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Invalid date range provided." });
    }

    // Convert to Date objects
    let parsedStartDate = new Date(startDate);
    let parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
      return res.status(400).json({ message: "Invalid date format provided." });
    }

    // Adjust endDate to include the entire day
    parsedEndDate.setHours(23, 59, 59, 999);

    // Calculate the last two days from the endDate
    let lastTwoDates = [];
    for (let i = 1; i >= 0; i--) {
      let date = new Date(parsedEndDate);
      date.setDate(date.getDate() - i);
      lastTwoDates.push(date.toISOString().split("T")[0]); // Format as 'YYYY-MM-DD'
    }

    // Build query with optional campaignname filtering
    let query = { Date: { $in: lastTwoDates } };
    if (campaignname) {
      query.campaignname = campaignname;
    }

    // Fetch analytics data for these last two dates and campaign (if provided)
    let analyticsData = await Analytics.find(query);

    if (!analyticsData.length) {
      return res
        .status(404)
        .json({ message: "No data found for the given range and campaign." });
    }

    console.log("Fetched Analytics Data:", analyticsData);

    // Hourly percentage distribution for Visits & Cost
    let percentagePattern = [
      3, 2, 4, 2, 1, 3, 4, 1, 2, 5, 3, 2, 6, 2, 8, 3, 11, 9, 4, 5, 6, 8, 4, 2,
    ];

    // Ensure the percentage pattern sums to 100
    let totalPercentage = percentagePattern.reduce((sum, p) => sum + p, 0);

    // Process data for each date and generate 24 rows per day
    let transformedData = [];

    analyticsData.forEach((entry) => {
      let totalVisits = Number(entry.Vistis) || 0;
      let totalCost = Number(entry.Cost) || 0;

      let distributedVisits = 0;
      let distributedCost = 0;
      let hourlyCosts = [];

      for (let hour = 0; hour < 24; hour++) {
        // Distribute visits and cost using percentage pattern
        let visitShare = Math.round(
          (percentagePattern[hour] / totalPercentage) * totalVisits
        );
        let costShare = (percentagePattern[hour] / totalPercentage) * totalCost;

        // Store hourly cost values for adjustment later
        hourlyCosts.push(costShare);

        distributedVisits += visitShare;
        distributedCost += costShare;
      }

      // Adjust the last hour to fix rounding issues so the sum matches totalCost
      let totalDistributedCost = hourlyCosts.reduce((acc, c) => acc + c, 0);
      let roundingError = totalCost - totalDistributedCost;
      hourlyCosts[23] += roundingError; // Adjust last hour

      // Now store the transformed data
      for (let hour = 0; hour < 24; hour++) {
        let formattedCost = parseFloat(hourlyCosts[hour]).toFixed(2); // Properly format cost
        let visitShare = Math.round(
          (percentagePattern[hour] / totalPercentage) * totalVisits
        ); // Correct scope

        let cpc =
          visitShare > 0 ? (hourlyCosts[hour] / visitShare).toFixed(2) : "0.00";

        transformedData.push({
          Date: entry.Date, // Same date repeated for each row
          HourUTC: hour,
          Visits: visitShare,
          Cost: formattedCost,
          CPC: cpc,
          campaignname: entry.campaignname,
          BidRequest: entry.BidRequest,
          WinRate: entry.WinRate,
          ConversionRate: entry.CoversionRate,
          CostConversion: entry.CostConversion,
        });
      }
    });

    res.status(200).json(transformedData);
  } catch (err) {
    console.error("Error fetching analytics data:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", errormsg: err.message });
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
