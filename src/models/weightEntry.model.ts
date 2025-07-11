import { Schema, model, Document, Types } from 'mongoose';

export interface IWeightEntry extends Document {
  userId: Types.ObjectId;
  weight: number;
  recordedAt: Date;
  notes?: string;
}

const weightEntrySchema = new Schema<IWeightEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    recordedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user
weightEntrySchema.index({ userId: 1, recordedAt: -1 });

export const WeightEntry = model<IWeightEntry>('WeightEntry', weightEntrySchema);
