import express from "express";
import multer from "multer";
import csv from "csv-parser";
import Summary from "../models/newcompaingmodel.js"; // Ensure you have the correct path to your Summary model
import { Stream } from "stream";

const router = express.Router(); // Use express.Router() instead of express()

// Multer setup for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle CSV upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const results = [];
    const fileBuffer = req.file.buffer.toString("utf8");
    const readableStream = Stream.Readable.from(fileBuffer.split("\n"));
    const csvParser = csv();

    await new Promise((resolve, reject) => {
      readableStream
        .pipe(csvParser)
        .on("data", (data) => {
          // Assuming the CSV columns match the schema fields
          // Optionally add data validation or transformation logic here
          const formattedData = {
            adFormat: data.adFormat || "",
            id: data.id || "",
            adFor: data.adFor || "",
            campaignName: data.campaignName || "",
            compaignImage: data.compaignImage || "",
            campaignBid: data.campaignBid || "",
            geo: data.geo || "",
            bidRequests: data.bidRequests || "",
            videoImp: data.videoImp || "",
            visits: data.visits || "",
            winRate: data.winRate || "",
            cost: data.cost || "",
            dailyCap: data.dailyCap || "",
            title: data.title || "",
            descriptionone: data.descriptionone || "",
            descriptiontwo: data.descriptiontwo || "",
            destinationURL: data.destinationURL || "",
            displayURL: data.displayURL || "",
            entryDate: data.entryDate || "",
          };

          // Ensure that only valid data is pushed to results
          results.push(formattedData);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log("Inserting data:", results);

    // Insert data into the database
    await Summary.insertMany(results);

    res.status(200).json({
      success: true,
      message: "Summary data successfully uploaded",
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error inserting data",
      errormsg: error.message,
    });
  }
});

export default router;
