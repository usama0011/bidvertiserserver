// models/monthlyInvoice.js
import mongoose from "mongoose";

const monthlyInvoiceSchema = new mongoose.Schema(
  {
    Date: {
      type: String, // Keeping it as a string in "YYYY-MM-DD" format
      required: true,
    },
    Amount: {
      type: Number, // Storing amount as a number
      required: true,
    },
    Invoice: {
      type: String, // Could be a file URL or a reference to an invoice document
      required: true,
    },
  },
  { timestamps: true } // This adds "createdAt" and "updatedAt" fields automatically
);

const MonthlyInvoice = mongoose.model("MonthlyInvoice", monthlyInvoiceSchema);

export default MonthlyInvoice;
