import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Format: MM/DD/YYYY
      required: true,
    },
    startingBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
    },
    bonus: {
      type: Number,
      required: true,
      default: 0,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String, // E.g., "PayPal", "Crypto"
      required: true,
    },
    status: {
      type: String, // "Approved" or "Failed"
      enum: ["Approved", "Failed"],
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    statementDescription: {
      type: String,
      required: true,
    },
    invoice: {
      type: String, // Stores invoice reference or URL
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
