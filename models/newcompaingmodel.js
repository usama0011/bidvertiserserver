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
    campaignName: {
      type: String,
    },
    campaignBid: {
      type: Number,
    },
    geo: {
      type: String,
    },
    bidRequests: {
      type: Number,
    },
    videoImp: {
      type: Number,
      required: false,
    },
    visits: {
      type: Number,
    },
    winRate: {
      type: Number,
    },
    cost: {
      type: Number,
    },
    dailyCap: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("NewCampaign", campaignSchema);
