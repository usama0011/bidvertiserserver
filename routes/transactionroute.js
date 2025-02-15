import express from "express";
import Transaction from "../models/transactionmodel.js";

const router = express.Router();

// ✅ Fetch all transactions (sorted by latest date)
router.get("/getalldata", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Add a new transaction
router.post("/", async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res
      .status(201)
      .json({ message: "Transaction added successfully", newTransaction });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Failed to add transaction" });
  }
});

// ✅ Get transactions by specific date (MM/DD/YYYY)
router.get("/date/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const transactions = await Transaction.find({ date }).sort({
      createdAt: -1,
    });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this date" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions by date:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete a transaction by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

export default router;
