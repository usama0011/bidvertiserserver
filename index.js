import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import summaryroute from "./routes/summaryroute.js";
import newcompaingroute from "./routes/newcompaingroute.js";

const app = express();
dotenv.config();

try {
  await mongoose.connect(
    "mongodb+srv://moizbhai:moizbhai@cluster0.sbspkgz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("Database Connection Successfully!!");
} catch (error) {
  console.error("Error connecting to MongoDB:", error.message);
  process.exit(1); // Exit the process if unable to connect to MongoDB
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Define a simple route
app.get("/", (req, res) => {
  res.status(200).json("App Work 100% Bitviseror");
});

// Start router from here
app.use("/api/summary", summaryroute);
app.use("/api/newcompaing", newcompaingroute);
// Error handling middleware
// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

// Start the server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
