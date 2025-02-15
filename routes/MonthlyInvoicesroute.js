// routes/invoiceRoutes.js
import express from "express";
import MonthlyInvoice from "../models/MonthlyInvoices.js";

const router = express.Router();

// ✅ Add a new invoice
router.post("/add", async (req, res) => {
  try {
    const { date, amount, invoice } = req.body;

    if (!date || !amount || !invoice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newInvoice = new MonthlyInvoice({ date, amount, invoice });
    await newInvoice.save();

    res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Error adding invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get all invoices (sorted by latest date)
router.get("/", async (req, res) => {
  try {
    const { year } = req.query; // Get year from query params

    // Define the search filter (if year is provided, filter by it)
    let filter = {};
    if (year) {
      filter.Date = new RegExp(year, "i"); // Matches "2024" in "January 2024"
    }

    // Fetch invoices with filtering and sorting (latest first)
    const invoices = await MonthlyInvoice.find(filter).sort({ createdAt: -1 });

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get a specific invoice by ID
router.get("/:id", async (req, res) => {
  try {
    const invoice = await MonthlyInvoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Update an invoice by ID
router.put("/update/:id", async (req, res) => {
  try {
    const { date, amount, invoice } = req.body;
    const updatedInvoice = await MonthlyInvoice.findByIdAndUpdate(
      req.params.id,
      { date, amount, invoice },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete an invoice by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedInvoice = await MonthlyInvoice.findByIdAndDelete(
      req.params.id
    );

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
