import mongoose from "mongoose";

const { Schema } = mongoose;

const campaignSchema = new Schema(
  {
    adFormat: {
      type: String,
    },
    id: {
      type: Number, // Changed to Number
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
      type: Number, // Changed to Number
    },
    geo: {
      type: String,
    },
    bidRequests: {
      type: Number, // Changed to Number
    },
    videoImp: {
      type: String,
      required: false,
    },
    visits: {
      type: Number, // Changed to Number
    },
    winRate: {
      type: Number, // Changed to Number
    },
    cost: {
      type: String,
    },
    dailyCap: {
      type: Number, // Changed to Number
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
    destinationURL: {
      type: String,
    },
    displayURL: {
      type: String,
    },
    entryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("NewCampaign", campaignSchema);
