import mongoose from "mongoose";

const { Schema } = mongoose;

const analyticsSchema = new Schema(
  {
   
  },
  { timestamps: true }
);

export default mongoose.model("Order", analyticsSchema);
