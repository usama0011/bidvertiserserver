import mongoose from "mongoose";

const { Schema } = mongoose;

const summerSchema = new Schema(
  {
    startdate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    AdRequests: {
      type: Number,
      required: true,
    },
    Visits: {
      type: Number,
      required: true,
    },
    Cost: {
      type: Number,
      required: true,
    },
    CPC: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Summary", summerSchema);
