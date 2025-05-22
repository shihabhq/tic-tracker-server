import mongoose, { Schema, Document } from "mongoose";

interface IStat extends Document {
  played: number;
  lose: number;
  won: number;
  draw: number;
}

const StatSchema = new Schema<IStat>({
  played: { type: Number, default: 0 },
  lose: { type: Number, default: 0 },
  won: { type: Number, default: 0 },
  draw: { type: Number, default: 0 },
});

export const Stats = mongoose.model<IStat>("Stats", StatSchema);
