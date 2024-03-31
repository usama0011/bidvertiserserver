import mongoose from "mongoose";

const { Schema } = mongoose;

const dailyActivity = new Schema({}, { timestamps: true });

export default mongoose.model("DailyActivity", dailyActivity);
