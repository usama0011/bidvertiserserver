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
    compaignImage: {
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
    title: {
      type: String,
    },
    descriptionone: {
      type: String,
    },
    descriptiontwo: {
      type: String,
    },
    displayURL: {
      type: String,
    },
    entryDate: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("NewCampaign", campaignSchema);
