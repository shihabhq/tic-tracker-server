import mongoose, { Schema, Document } from "mongoose";

export interface IStat extends Document {
  name: string;
  email: string;
  played: number;
  lose: number;
  won: number;
  draw: number;
}

const StatSchema = new Schema<IStat>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  played: { type: Number, default: 0 },
  lose: { type: Number, default: 0 },
  won: { type: Number, default: 0 },
  draw: { type: Number, default: 0 },
});

export const Stats = mongoose.model<IStat>("Stats", StatSchema);
