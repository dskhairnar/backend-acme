import { Schema, model, Document, Types } from 'mongoose';

export interface IMedication extends Document {
  userId: Types.ObjectId;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
}

const medicationSchema = new Schema<IMedication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user
medicationSchema.index({ userId: 1, startDate: -1 });

export const Medication = model<IMedication>('Medication', medicationSchema);
