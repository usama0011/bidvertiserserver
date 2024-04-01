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
      type: String,
      required: true,
    },
    Visits: {
      type: String,
      required: true,
    },
    Cost: {
      type: String,
      required: true,
    },
    CPC: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Summary", summerSchema);
