import express from "express";
import multer from "multer";
import csv from "csv-parser";
import DailyActivity from "../models/dailactivitymodel.js"; // Ensure you have the correct path to your DailyActivity model
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
          console.log("Parsed data:", data);

          // Format data to match the schema
          const formattedData = {
            Date: data.Date || "",
            BidRequest: data.BidRequest || "",
            Vistis: data.Vistis || "",
            campaignname: data.campaignname || "",
            WinRate: data.WinRate || "",
            Cost: data.Cost || "",
            CPC: data.CPC || "",
            CoversionRate: data.CoversionRate || "",
            CostConversion: data.CostConversion || "",
          };

          // Ensure that only valid data is pushed to results
          results.push(formattedData);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log("Inserting data:", results);

    // Insert data into the database
    await DailyActivity.insertMany(results);

    res.status(200).json({
      success: true,
      message: "Daily Activity data successfully uploaded",
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
