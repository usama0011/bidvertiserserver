import mongoose from "mongoose";

const { Schema } = mongoose;

const campaignSchema = new Schema(
  {
    adFormat: {
      type: String,
    },
    id: {
      type: Number,
    },
    adFor: {
      type: String,
    },
    campaignName: {
      type: String,
    },
    campaignBid: {
      type: String,
    },
    geo: {
      type: String,
    },
    bidRequests: {
      type: String,
    },
    videoImp: {
      type: String,
      required: false,
    },
    visits: {
      type: String,
    },
    winRate: {
      type: String,
    },
    cost: {
      type: String,
    },
    dailyCap: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("NewCampaign", campaignSchema);
