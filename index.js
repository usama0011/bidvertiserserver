import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import summaryroute from "./routes/summaryroute.js";
import googlerechapchverify from "./routes/authroute.js";
import newcompaingroute from "./routes/newcompaingroute.js";
import analyticsroute from "./routes/analyticsroute.js";
import dailyactivity from "./routes/dailyactivityroute.js";
import invoiceRoutes from "./routes/MonthlyInvoicesroute.js";
import summerycsvupload from "./csvroutes/summerycsv.js";
import analyticsupload from "./csvroutes/analyticscsv.js";
import dailyactivityupload from "./csvroutes/dailyactivitycsv.js";
import monthlyinvoiceupload from "./csvroutes/monthlyinvoicecsv.js";
import transactionRoutes from "./routes/transactionroute.js";
import transactionUploadRoutes from "./csvroutes/transactioncsv.js";
import newcampaingsupload from "./csvroutes/newcampaigncsv.js";

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
app.use("/api/analytics", analyticsroute);
app.use("/api/dailyactivity", dailyactivity);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/summeryupload", summerycsvupload);
app.use("/api/verify-recaptcha", googlerechapchverify);
app.use("/api/analyticsupload", analyticsupload);
app.use("/api/dailyactivityupload", dailyactivityupload);
app.use("/api/monthlyinvoiceupload", monthlyinvoiceupload);
app.use("/api/transactionRoutes", transactionRoutes);
app.use("/api/transactionupload", transactionUploadRoutes);
app.use("/api/newcampaingsupload", newcampaingsupload);
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
