import mongoose from "mongoose";

const { Schema } = mongoose;

const dailyActivity = new Schema({
    Date: { type: String },
    BidRequest: { type: String },
    Vistis: { type: String },
    WinRate: { type: String },
    Cost: { type: String },
    CPC: { type: String },
    CoversionRate: { type: String },
    CostConversion: { type: String },
}, { timestamps: true });

export default mongoose.model("DailyActivity", dailyActivity);

